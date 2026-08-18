import React from 'react';

const variants = {
    primary: 'bg-cinnamon-600 text-cream-50 hover:bg-cinnamon-700 shadow-premium hover:shadow-lg',
    secondary: 'bg-transparent text-cinnamon-700 border-2 border-cinnamon-600 hover:bg-cinnamon-600 hover:text-cream-50',
    ghost: 'bg-transparent text-cinnamon-700 hover:bg-cinnamon-50',
    gold: 'bg-gradient-to-r from-gold-500 to-gold-400 text-white hover:from-gold-600 hover:to-gold-500 shadow-md',
    cream: 'bg-cream-100 text-cinnamon-800 hover:bg-cream-200 border border-cream-300',
    dark: 'bg-cinnamon-900 text-cream-100 hover:bg-cinnamon-800',
    white: 'bg-white text-cinnamon-800 hover:bg-cream-100 shadow-md',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    rounded = false,
    onClick,
    type = 'button',
    ...rest
}) => {
    const base =
        'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const roundedClass = rounded ? 'rounded-full' : 'rounded-xl';

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${sizes[size]} ${roundedClass} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...rest}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            {children}
            {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
        </button>
    );
};

export default Button;
