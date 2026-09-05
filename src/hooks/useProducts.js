import { useState, useCallback, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';
import { productsApi, adminApi } from '../services/api';

const STORAGE_KEY = 'ceylon_products_override';

// Load admin-managed products from localStorage
const loadOverrides = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deleted: [] };
  } catch {
    return { added: [], edited: {}, deleted: [] };
  }
};

const saveOverrides = (overrides) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

// Merge base products with admin overrides
const mergeProducts = (overrides) => {
  const { added = [], edited = {}, deleted = [] } = overrides;
  const deletedSet = new Set(deleted);

  const base = defaultProducts
    .filter((p) => !deletedSet.has(p.id))
    .map((p) => (edited[p.id] ? { ...p, ...edited[p.id] } : p));

  return [...base, ...added.filter((p) => !deletedSet.has(p.id))];
};

export const useProducts = () => {
  const [overrides, setOverrides] = useState(loadOverrides);
  const [products, setProducts] = useState(() => mergeProducts(loadOverrides()));
  const [loading, setLoading] = useState(true);

  // Fetch live products from Backend API (Firestore)
  const fetchLiveProducts = useCallback(async () => {
    try {
      const res = await productsApi.getAll({ limit: 50 });
      if (res.success && res.data?.items && res.data.items.length > 0) {
        setProducts(res.data.items);
      }
    } catch (err) {
      console.warn('Backend products fetch fallback to local cache:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

  const refresh = useCallback((newOverrides) => {
    saveOverrides(newOverrides);
    setOverrides(newOverrides);
    setProducts(mergeProducts(newOverrides));
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        const fresh = loadOverrides();
        setOverrides(fresh);
        setProducts(mergeProducts(fresh));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addProduct = useCallback(async (product) => {
    try {
      const res = await adminApi.createProduct(product);
      if (res.success && res.data) {
        fetchLiveProducts();
        return res.data;
      }
    } catch (err) {
      console.warn('Backend addProduct error, using local fallback:', err.message);
    }

    const current = loadOverrides();
    const newProduct = {
      ...product,
      id: `admin_${Date.now()}`,
      slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    const updated = { ...current, added: [...(current.added || []), newProduct] };
    refresh(updated);
    return newProduct;
  }, [fetchLiveProducts, refresh]);

  const updateProduct = useCallback(async (id, changes) => {
    try {
      const res = await adminApi.updateProduct(id, changes);
      if (res.success) {
        fetchLiveProducts();
        return;
      }
    } catch (err) {
      console.warn('Backend updateProduct error, using local fallback:', err.message);
    }

    const current = loadOverrides();
    const isAdminAdded = String(id).startsWith('admin_');
    if (isAdminAdded) {
      const updated = {
        ...current,
        added: (current.added || []).map((p) => (p.id === id ? { ...p, ...changes } : p)),
      };
      refresh(updated);
    } else {
      const updated = {
        ...current,
        edited: { ...(current.edited || {}), [id]: { ...(current.edited?.[id] || {}), ...changes } },
      };
      refresh(updated);
    }
  }, [fetchLiveProducts, refresh]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const res = await adminApi.deleteProduct(id);
      if (res.success) {
        fetchLiveProducts();
        return;
      }
    } catch (err) {
      console.warn('Backend deleteProduct error, using local fallback:', err.message);
    }

    const current = loadOverrides();
    const isAdminAdded = String(id).startsWith('admin_');
    if (isAdminAdded) {
      const updated = {
        ...current,
        added: (current.added || []).filter((p) => p.id !== id),
      };
      refresh(updated);
    } else {
      const updated = {
        ...current,
        deleted: [...new Set([...(current.deleted || []), id])],
      };
      refresh(updated);
    }
  }, [fetchLiveProducts, refresh]);

  const resetAllOverrides = useCallback(() => {
    const empty = { added: [], edited: {}, deleted: [] };
    refresh(empty);
    fetchLiveProducts();
  }, [fetchLiveProducts, refresh]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    resetAllOverrides,
    refetch: fetchLiveProducts,
  };
};
