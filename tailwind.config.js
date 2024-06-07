/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

const _colors = Object.assign({
	c1: {
        '50': '#f7f6f9',
        '100': '#edecf2',
        '200': '#d7d4e3',
        '300': '#b3aecb',
        '400': '#8982ae',
        '500': '#6b6394',
        '600': '#564e7b',
        '700': '#484064',
        '800': '#3e3854',
        '900': '#373248',
        '950': '#0a090d',
        DEFAULT: '#0a090d',
    },
	c2: {
        '50': '#fbf6fe',
        '100': '#f5ebfc',
        '200': '#eddbf9',
        '300': '#dfbff3',
        '400': '#c589e8',
        '500': '#b66ddf',
        '600': '#a34ecf',
        '700': '#8c3bb5',
        '800': '#763594',
        '900': '#602c77',
        '950': '#421556',
		DEFAULT: "#c589e8",
    },
	c3: {
        '50': '#f0faff',
        '100': '#dff5ff',
        '200': '#b8ecff',
        '300': '#85e2ff',
        '400': '#33d0fd',
        '500': '#09baee',
        '600': '#0096cc',
        '700': '#0078a5',
        '800': '#046588',
        '900': '#0a5470',
        '950': '#06354b',
		DEFAULT: "#85e2ff",
    },
	c4:  {
        '50': '#eff8ff',
        '100': '#deefff',
        '200': '#b6e1ff',
        '300': '#76caff',
        '400': '#2db0ff',
        '500': '#0296f5',
        '600': '#0076d2',
        '700': '#005eaa',
        '800': '#004e89',
        '900': '#074273',
        '950': '#042a4d',
		DEFAULT: "#004e89",
    },
	c5: {
        '50': '#f3f3ff',
        '100': '#e9e8ff',
        '200': '#d5d5ff',
        '300': '#b6b3ff',
        '400': '#9188fd',
        '500': '#6e58fa',
        '600': '#5b35f2',
        '700': '#4c23de',
        '800': '#3f1dba',
        '900': '#361a98',
        '950': '#1e0e67',
		DEFAULT: '#5b35f2',
    },
    
    
}, colors);

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
    theme: {
		colors: _colors,
        extend: {
			gridRow: {
				'span-7': 'span 7 / span 7',
				'span-8': 'span 8 / span 8',
				'span-9': 'span 9 / span 9',
				'span-10': 'span 10 / span 10',
				'span-11': 'span 11 / span 11',
				'span-12': 'span 12 / span 12',
			},
			gridCol: {
				'span-7': 'span 7 / span 7',
				'span-8': 'span 8 / span 8',
				'span-9': 'span 9 / span 9',
				'span-10': 'span 10 / span 10',
				'span-11': 'span 11 / span 11',
				'span-12': 'span 12 / span 12',
			},
		},
    },
    plugins: [
		require('tailwind-scrollbar'),
	],
}


