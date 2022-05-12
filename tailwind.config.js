const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
    purge: {
        content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
        safelist: [
            /(border|bg|text)-(.*)-(50|100|200|300|400|500|600|700|800|900)/,
        ],
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            gray: colors.neutral,
            red: colors.red,
            orange: colors.orange,
            amber: colors.amber,
            yellow: colors.yellow,
            lime: colors.lime,
            green: colors.green,
            emerald: colors.emerald,
            teal: colors.teal,
            cyan: colors.cyan,
            sky: colors.sky,
            blue: colors.blue,
            indigo: colors.indigo,
            violet: colors.violet,
            purple: colors.purple,
            fuchsia: colors.fuchsia,
            pink: colors.pink,
            rose: colors.rose,
            white: colors.white,
            black: colors.black,
        },
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
            spacing: {
                128: '32rem',
                192: '48rem',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['active', 'compact'],
            backgroundOpacity: ['active'],
            display: ['group-hover', 'group-focus', 'compact'],
            padding: ['compact'],
            width: ['compact'],
            height: ['compact'],
            inset: ['compact'],
            fontSize: ['compact'],
            borderWidth: ['compact'],
            boxShadow: ['compact'],
            textColor: ['compact'],
            margin: ['compact'],
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
