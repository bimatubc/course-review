/* eslint-disable no-unused-vars */
/**
 * Helper function to generate a UUID
 * @returns {string} - A new UUID
 */
function generateUUID() {
	const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	const uuid = template.replaceAll(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c == 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})

	return uuid
}

/**
 * Helper function to check if an object is empty
 * @param {obj} - The object to be checked
 * @returns {boolean} - True if the object is empty, false otherwise
 */
function isObjectEmpty(objectName) {
	return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object
}

/**
 * Helper function to escape special characters for JSON serialisation
 * @param {input} - The input string to be escaped
 * @retursn {string} - An escaped string that can be safely serialised as JSON
 */
function specialCharForJSON(input) {
	// Replace backslashes with double backslashes
	let text = input.replace(/\\/g, '\\\\')

	// Replace double quotes with escaped double quotes
	text = text.replace(/"/g, '\\"')

	// Replace new line charactesr with \n
	text = text.replace(/\n/g, '\\n')

	return text
}
/* eslint-enable no-unused-vars */
