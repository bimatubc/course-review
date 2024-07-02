/* Database Structure
 * user: {
 *     id: UUID
 *     name: String
 *     email: String
 * }
 */

/* eslint-disable no-unused-vars */

/**
 * Append a new user to the User sheet
 * @param {Object} data - The user data to be appended
 */
function appendNewUser(data) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USERS)
	const rows = sheet.getDataRange().getValues().slice(1)

	// Check if the user already exists
	const existingUser = rows.find((row) => row[2] === data.email)

	if (existingUser) {
		data.id = existingUser[0]
		Logger.log('User already exists with the same name and email')
	} else {
		data.id = generateUUID()

		// Deconstruct data to make sure everything is in the correct order
		const newUser = [data.id, data.name, data.email]

		// Insert new user into the Users sheet
		sheet.appendRow(newUser)
		Logger.log('Inserted new user data into Users sheet')
	}
}

// Wrapper function to get all users
function getUsers() {
	return getSheetData('Users')
}

/* Note:
 * We can use ScriptProperties to configure secret variables
 * Useful for when we need to define Ids for sheets and forms
 */

/**
 * Get user data by its unique ID
 * @param {String} targetId - The unique identifier for the desired user
 */
function getUserById(targetId) {
	Logger.log(`Searching for user by ID: ${targetId}`)
	// Get the sheet for users
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USERS)

	if (!sheet) {
		Logger.log('USER SHEET NOT FOUND!!')
		// Return error if user sheet is not found
		return ContentService.createTextOutput(
			JSON.stringify({
				error:
					'Users sheet not found!\nThis is not an intended behaviour, please inform the developers immediately!'
			})
		).setMimeType(ContentService.MimeType.JSON)
	}

	// Get the values of each row, remove the first row
	const rows = sheet.getDataRange().getValues()
	const headers = rows.shift()

	// Find the user with the same id
	const user = rows.find((row) => row[0] === targetId)

	if (!user) {
		return ContentService.createTextOutput(
			JSON.stringify({ error: 'User not found!' })
		).setMimeType(ContentService.MimeType.JSON)
	}

	const userData = headers.reduce((obj, header, index) => {
		obj[header] = user[index]
		return obj
	}, {})

	// Return the data as JSON
	return ContentService.createTextOutput(JSON.stringify(userData)).setMimeType(
		ContentService.MimeType.JSON
	)
}

/* eslint-enable no-unused-vars */
