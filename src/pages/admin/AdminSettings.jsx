import { useState } from 'react';
import { Save, Store, Truck } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminSettings = () => {
    const { settings, updateSettings } = useAdmin();
    const [form, setForm] = useState({ ...settings });
    const [saved, setSaved] = useState(false);

    const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings({
            ...form,
            freeShippingThreshold: parseFloat(form.freeShippingThreshold) || 0,
            defaultShippingRate: parseFloat(form.defaultShippingRate) || 0,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Store Info */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-cinnamon-100 rounded-xl flex items-center justify-center">
                            <Store className="w-5 h-5 text-cinnamon-700" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">Store Information</h2>
                            <p className="text-sm text-gray-400">Basic store details</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                            <input type="text" value={form.storeName} onChange={e => updateField('storeName', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                            <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                            <select value={form.currency} onChange={e => updateField('currency', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm">
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="LKR">LKR (Rs)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                            <textarea rows="2" value={form.address} onChange={e => updateField('address', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm resize-none" />
                        </div>
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Truck className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">Shipping Settings</h2>
                            <p className="text-sm text-gray-400">Configure shipping rates</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Threshold ($)</label>
                            <input type="number" step="0.01" value={form.freeShippingThreshold} onChange={e => updateField('freeShippingThreshold', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Shipping Rate ($)</label>
                            <input type="number" step="0.01" value={form.defaultShippingRate} onChange={e => updateField('defaultShippingRate', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Applied to orders below the free shipping threshold</p>
                        </div>
                    </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                    <button type="submit" className="inline-flex items-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-premium text-sm">
                        <Save className="w-4 h-4" /> Save Settings
                    </button>
                    {saved && (
                        <span className="text-sm font-medium text-green-600 animate-fade-in">✓ Settings saved successfully!</span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
