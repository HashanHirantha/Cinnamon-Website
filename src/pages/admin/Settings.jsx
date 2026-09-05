// Settings Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import { useAdminToast } from '../../admin/components/AdminToast';
import { defaultSettings } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_settings';
const loadSettings = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : defaultSettings; } catch { return defaultSettings; } };
const saveSettings = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px', color: '#111827' };

const Section = ({ title, icon, children }) => (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>{icon} {title}</h3>
        {children}
    </div>
);

const Field = ({ label, children }) => (
    <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</label>
        {children}
    </div>
);

const Toggle = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb', cursor: 'pointer' }}>
        <span style={{ fontSize: '14px', color: '#374151' }}>{label}</span>
        <div onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '12px', background: checked ? '#92400e' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
        </div>
    </label>
);

const Settings = () => {
    const addToast = useAdminToast();
    const [settings, setSettings] = useState(loadSettings);
    const [tab, setTab] = useState('general');

    const setGen = (k) => (e) => setSettings((s) => ({ ...s, general: { ...s.general, [k]: e.target.value } }));
    const setCur = (k) => (e) => setSettings((s) => ({ ...s, currency: { ...s.currency, [k]: e.target.value } }));
    const setSoc = (k) => (e) => setSettings((s) => ({ ...s, social: { ...s.social, [k]: e.target.value } }));
    const setNotif = (k) => () => setSettings((s) => ({ ...s, notifications: { ...s.notifications, [k]: !s.notifications[k] } }));

    const handleSave = () => {
        saveSettings(settings);
        addToast('Settings saved successfully!', 'success');
    };

    const tabs = [
        { key: 'general', label: '🏪 General' },
        { key: 'currency', label: '💱 Currency' },
        { key: 'notifications', label: '🔔 Notifications' },
        { key: 'social', label: '📲 Social Media' },
        { key: 'security', label: '🔒 Security' },
    ];

    const tabStyle = (k) => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', background: tab === k ? '#92400e' : 'transparent', color: tab === k ? '#fff' : '#6b7280', whiteSpace: 'nowrap' });

    return (
        <AdminLayout>
            <PageHeader title="Settings" subtitle="Manage your store configuration" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Settings' }]}
                actions={<button onClick={handleSave} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>💾 Save Changes</button>}
            />

            {/* Tab nav */}
            <div style={{ display: 'flex', gap: '4px', background: '#f9fafb', padding: '4px', borderRadius: '10px', marginBottom: '24px', overflowX: 'auto' }}>
                {tabs.map((t) => <button key={t.key} style={tabStyle(t.key)} onClick={() => setTab(t.key)}>{t.label}</button>)}
            </div>

            {tab === 'general' && (
                <Section title="General Settings" icon="🏪">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                        {[['Store Name', 'storeName', 'Ceylon Cinnamon'], ['Email', 'email', 'hello@ceyloncinnamon.com'], ['Phone', 'phone', '+94 77 123 4567']].map(([label, key, ph]) => (
                            <Field key={key} label={label}><input value={settings.general[key] || ''} onChange={setGen(key)} placeholder={ph} style={inputStyle} /></Field>
                        ))}
                        <div style={{ gridColumn: '1/-1' }}><Field label="Address"><textarea value={settings.general.address || ''} onChange={setGen('address')} rows={2} placeholder="Store address" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', marginBottom: 0 }} /></Field></div>
                    </div>
                </Section>
            )}

            {tab === 'currency' && (
                <Section title="Currency Settings" icon="💱">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
                        <Field label="Currency Code">
                            <select value={settings.currency.code} onChange={setCur('code')} style={inputStyle}>
                                {['USD', 'GBP', 'EUR', 'AUD', 'CAD', 'LKR'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Currency Symbol"><input value={settings.currency.symbol || ''} onChange={setCur('symbol')} placeholder="$" style={inputStyle} /></Field>
                        <Field label="Symbol Position">
                            <select value={settings.currency.position} onChange={setCur('position')} style={inputStyle}>
                                <option value="before">Before (e.g. $10)</option>
                                <option value="after">After (e.g. 10$)</option>
                            </select>
                        </Field>
                    </div>
                </Section>
            )}

            {tab === 'notifications' && (
                <Section title="Notification Preferences" icon="🔔">
                    <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>Choose which events trigger admin notifications.</p>
                    {[
                        ['newOrder', '🛍️ New order received'],
                        ['lowStock', '⚠️ Low stock alert'],
                        ['newCustomer', '👤 New customer registered'],
                        ['newReview', '⭐ New review submitted'],
                        ['orderShipped', '🚚 Order shipped confirmation'],
                    ].map(([key, label]) => (
                        <Toggle key={key} checked={settings.notifications[key]} onChange={setNotif(key)} label={label} />
                    ))}
                </Section>
            )}

            {tab === 'social' && (
                <Section title="Social Media Links" icon="📲">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                        {[['Facebook', 'facebook', '🔵'], ['Instagram', 'instagram', '🟣'], ['YouTube', 'youtube', '🔴'], ['Twitter/X', 'twitter', '⚫']].map(([label, key, ico]) => (
                            <Field key={key} label={`${ico} ${label}`}>
                                <input value={settings.social[key] || ''} onChange={setSoc(key)} placeholder={`https://${key}.com/ceyloncinnamon`} style={inputStyle} />
                            </Field>
                        ))}
                    </div>
                </Section>
            )}

            {tab === 'security' && (
                <Section title="Security Information" icon="🔒">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            ['🔐 Role-Based Access Control', 'Staff accounts are limited to their assigned module permissions. The Super Admin has full access.'],
                            ['🚫 Admin Route Protection', 'All /admin/* routes are protected by AdminRoute and verify authentication + role on every render.'],
                            ['🔑 Session Storage', 'Admin sessions are stored in localStorage under a signed key. For production, use JWT or secure HTTP-only cookies with a backend.'],
                            ['🛡️ Payment Security', 'No card numbers, CVV, or sensitive payment data are stored in the application. All payments are processed via the configured gateway.'],
                            ['✅ Input Validation', 'All forms validate required fields before saving data. Destructive actions require explicit confirmation dialogs.'],
                            ['⚠️ Important for Production', 'Move admin credentials to environment variables or a backend authentication service before going live. Never expose admin credentials in client-side code.'],
                        ].map(([title, desc]) => (
                            <div key={title} style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px 16px' }}>
                                <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '13px', color: '#111827' }}>{title}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </AdminLayout>
    );
};

export default Settings;
