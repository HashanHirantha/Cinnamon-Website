import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Persist a simple user object in localStorage so login survives refresh
const STORAGE_KEY = 'ceylone_user';

const loadUser = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(loadUser);

    const signIn = useCallback(({ email, password: _p }) => {
        // Frontend-only: accept any non-empty credentials
        if (!email) throw new Error('Email is required');
        const u = { email, name: email.split('@')[0] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUser(u);
    }, []);

    const signUp = useCallback(({ name, email, password: _p, phone, country, ...rest }) => {
        if (!name || !email) throw new Error('Name and email are required');
        const firstName = rest.firstName || name.split(' ')[0];
        const u = { email, name, firstName, phone, country };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUser(u);
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
