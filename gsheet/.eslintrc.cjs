// eslint for google appsscript

module.exports = {
	root: true,
	extends: ['eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: ['@stylistic/js', 'googleappsscript'],
	env: {
		node: true,
		'googleappsscript/googleappsscript': true
	},
	globals: {
		doGet: true,
		onFormSubmit: true,
		appendNewUser: true,
		appendNewCourse: true,
		appendNewInstructor: true,
		appendNewReview: true,
		getSheetData: true,
		getUsers: true,
		getUserById: true,
		getCourses: true,
		getCourseById: true,
		getCourseByCode: true,
		getInstructors: true,
		getInstructorById: true,
		getReviews: true,
		getReviewsById: true,
		generateUUID: true,
		isObjectEmpty: true,
		SHEET_NAMES: true
	},
	rules: {
		'no-redeclare': ['error', { builtinGlobals: false }],
		'@stylistic/js/indent': ['error', 'tab'], // Enforces tabs for indentation using @stylistic/eslint-plugin-js
		'@stylistic/js/no-tabs': 'off' // Disables the rule that prevents the use of tabs
	}
}
