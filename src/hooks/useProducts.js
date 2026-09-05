import { useState, useCallback, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';

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

    const addProduct = useCallback((product) => {
        const current = loadOverrides();
        // Generate a unique ID (timestamp-based to avoid clashing with static IDs)
        const newProduct = {
            ...product,
            id: `admin_${Date.now()}`,
            slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        };
        const updated = { ...current, added: [...(current.added || []), newProduct] };
        refresh(updated);
        return newProduct;
    }, [refresh]);

    const updateProduct = useCallback((id, changes) => {
        const current = loadOverrides();
        // Check if it's an admin-added product (id starts with 'admin_')
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
    }, [refresh]);

    const deleteProduct = useCallback((id) => {
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
    }, [refresh]);

    const resetAllOverrides = useCallback(() => {
        const empty = { added: [], edited: {}, deleted: [] };
        refresh(empty);
    }, [refresh]);

    return { products, addProduct, updateProduct, deleteProduct, resetAllOverrides };
};
