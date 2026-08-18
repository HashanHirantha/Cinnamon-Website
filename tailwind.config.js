/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cinnamon: {
                    50: '#fdf6f0',
                    100: '#faeada',
                    200: '#f5d1b0',
                    300: '#efb47f',
                    400: '#e68f4d',
                    500: '#c8692a',
                    600: '#A0522D',
                    700: '#7d3c1e',
                    800: '#5e2c14',
                    900: '#3f1c0c',
                },
                forest: {
                    50: '#f0f7f0',
                    100: '#d9edd9',
                    200: '#a8d3a8',
                    300: '#72b172',
                    400: '#448844',
                    500: '#2d6a2d',
                    600: '#1e4d1e',
                    700: '#163816',
                    800: '#0e2a0e',
                    900: '#081a08',
                },
                cream: {
                    50: '#FFFEF9',
                    100: '#FEFCF0',
                    200: '#FDF6DC',
                    300: '#F9EDBE',
                    400: '#F3E097',
                    500: '#E8CC6A',
                },
                gold: {
                    300: '#F5D78E',
                    400: '#E8B84B',
                    500: '#C9952A',
                    600: '#A07320',
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                accent: ['Cormorant Garamond', 'Georgia', 'serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-slower': 'float 10s ease-in-out infinite',
                'spin-slow': 'spin 20s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(30px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                'premium': '0 20px 60px -10px rgba(160, 82, 45, 0.3)',
                'card': '0 4px 24px rgba(0,0,0,0.08)',
                'card-hover': '0 16px 48px rgba(0,0,0,0.16)',
                'glass': '0 8px 32px rgba(0,0,0,0.1)',
            },
        },
    },
    plugins: [],
}
