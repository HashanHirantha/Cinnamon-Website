import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        {open ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

const AdminLogin = () => {
    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/admin';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [roleError, setRoleError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRoleError(false);
        if (!username.trim() || !password) {
            setError('Please enter both username and password.');
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // brief UX delay
        const result = adminLogin(username, password);
        setLoading(false);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0a06 0%, #1a0f05 50%, #0f0a06 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(146,64,14,0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-200px', right: '-100px',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(180,83,9,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1,
            }}>
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #92400e, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '28px',
                        boxShadow: '0 8px 32px rgba(146,64,14,0.5)',
                    }}>
                        🌿
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', margin: 0 }}>
                        Ceylon Cinnamon
                    </h1>
                    <p style={{ color: '#a16207', fontSize: '13px', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Admin Portal
                    </p>
                </div>

                {/* Login card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '40px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                }}>
                    <h2 style={{ color: '#f5f0e8', fontSize: '20px', fontWeight: '600', margin: '0 0 28px' }}>
                        Sign in to Dashboard
                    </h2>

                    {/* Role error */}
                    {roleError && (
                        <div style={{
                            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                            borderRadius: '10px', padding: '14px 16px', marginBottom: '20px',
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                        }}>
                            <span style={{ fontSize: '18px' }}>🚫</span>
                            <div>
                                <p style={{ color: '#ef4444', fontWeight: '600', margin: '0 0 4px', fontSize: '14px' }}>
                                    Access Denied
                                </p>
                                <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
                                    Your account role is not <strong style={{ color: '#f59e0b' }}>ADMIN</strong>.
                                    You do not have permission to access this area.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Credential error */}
                    {error && !roleError && (
                        <div style={{
                            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
                        }}>
                            <p style={{ color: '#ef4444', margin: 0, fontSize: '14px' }}>⚠ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Username */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', color: '#d1c5b0', fontSize: '13px',
                                fontWeight: '500', marginBottom: '8px', letterSpacing: '0.5px',
                            }}>
                                Username
                            </label>
                            <input
                                id="admin-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setFocused('username')}
                                onBlur={() => setFocused('')}
                                placeholder="Enter admin username"
                                autoComplete="username"
                                style={{
                                    width: '100%', padding: '13px 16px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${focused === 'username' ? '#d97706' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '10px', color: '#f5f0e8', fontSize: '15px',
                                    outline: 'none', transition: 'border-color 0.2s',
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{
                                display: 'block', color: '#d1c5b0', fontSize: '13px',
                                fontWeight: '500', marginBottom: '8px', letterSpacing: '0.5px',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused('')}
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                    style={{
                                        width: '100%', padding: '13px 48px 13px 16px', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: `1px solid ${focused === 'password' ? '#d97706' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '10px', color: '#f5f0e8', fontSize: '15px',
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#9ca3af', padding: '4px', display: 'flex',
                                    }}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="admin-login-submit"
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px',
                                background: loading
                                    ? 'rgba(146,64,14,0.5)'
                                    : 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
                                border: 'none', borderRadius: '10px', color: '#fff',
                                fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', letterSpacing: '0.3px',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(217,119,6,0.35)',
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#fff', borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite', display: 'inline-block',
                                    }} />
                                    Authenticating…
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Role diagram hint */}
                    <div style={{
                        marginTop: '28px', padding: '14px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Auth Flow
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                            {[
                                { icon: '🔑', label: 'Admin Login', active: true },
                                { icon: '🔐', label: 'Authentication' },
                                { icon: '👤', label: 'Check user role' },
                                { icon: '✅', label: 'Role = ADMIN → Dashboard', green: true },
                                { icon: '🚫', label: 'Other role → Access Denied', red: true },
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{step.icon}</span>
                                    <span style={{
                                        color: step.green ? '#34d399' : step.red ? '#f87171' : step.active ? '#d97706' : '#6b7280',
                                        fontWeight: step.active ? '600' : '400',
                                    }}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#4b5563', fontSize: '13px' }}>
                    <a href="/" style={{ color: '#92400e', textDecoration: 'none' }}>← Back to Store</a>
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: #4b5563; }
            `}</style>
        </div>
    );
};

export default AdminLogin;
