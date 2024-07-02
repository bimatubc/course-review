/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: ['@stylistic/js'],
	env: {
		node: true
	},
	rules: {
		'@stylistic/js/indent': ['error', 'tab'], // Enforces tabs for indentation using @stylistic/eslint-plugin-js
		'@stylistic/js/no-tabs': 'off' // Disables the rule that prevents the use of tabs
	}
}
