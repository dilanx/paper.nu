const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
    safelist: [
        {
            pattern:
                /(border|bg|text)-(gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700)/,
            variants: ['hover', 'active', 'dark', 'dark:hover', 'dark:active'],
        },
    ],
    darkMode: 'class',
    theme: {
        cursor: {
            auto: 'auto',
            default: 'default',
            pointer: 'pointer',
            wait: 'wait',
            text: 'text',
            move: 'move',
            'not-allowed': 'not-allowed',
            crosshair: 'crosshair',
            'zoom-in': 'zoom-in',
            grab: 'grab',
        },
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                gray: colors.neutral,
            },
            spacing: {
                128: '32rem',
                192: '48rem',
                imgw: '1440px',
                imgh: '960px',
            },
        },
    },
    plugins: [
        plugin(function ({ addVariant, e }) {
            addVariant('compact', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.compact-mode .${e(
                        `compact${separator}${className}`
                    )}`;
                });
            });
        }),
    ],
};
