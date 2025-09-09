// tailwind.config.js

import formsPlugin from '@tailwindcss/forms'; // <-- 1. Import the plugin at the top

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    safelist: [
        { pattern: /bg-primary-(100|200|300|400|500|600|700|800|900)/ },
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
            },
        },
    },
    plugins: [
        formsPlugin, // <-- 2. Use the imported plugin here
    ],
}