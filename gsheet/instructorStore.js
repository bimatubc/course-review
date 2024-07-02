/* Database Structure
 * instructor: {
 *     id: UUID
 *     name: String
 * }
 */

/* eslint-disable no-unused-vars */

/**
 * Append a new instrucotr to the Instructor sheet
 * @param {Object} data - The instructor data to be appended
 */
function appendNewInstructor(data) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INSTRUCTOR)
	const rows = sheet.getDataRange().getValues().slice(1)

	// Check if the instructor already exists
	const existingInstructor = rows.find((row) => row[1] === data.name)

	if (existingInstructor) {
		data.id = existingInstructor[0]
		Logger.log('Instructor already exists with the same name')
	} else {
		data.id = generateUUID()

		// Deconstruct data to make sure everything is in the correct order
		const newInstructor = [data.id, data.name]

		// Insert new instructor into the Instructors sheet
		sheet.appendRow(newInstructor)
		Logger.log('Inserted new instructor data into Instructors sheet')
	}
}

// Wrapper function to get all instructors
function getInstructors() {
	return getSheetData('Instructors')
}

/**
 * Get instructor data by its unique ID
 * @param {string} targetId - The unique identifier for the desired instructor
 */
function getInstructorById(targetId) {
	Logger.log(`Searching for instructor by ID: ${targetId}`)
	// Get the sheet for users
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.INSTRUCTOR)

	if (!sheet) {
		Logger.log('INSTRUCTOR SHEET NOT FOUND!!')
		// Return error if user sheet is not found
		return ContentService.createTextOutput(
			JSON.stringify({
				error:
					'Instructor sheet not found!\nThis is not an intended behaviour, please inform the developers immediately!'
			})
		).setMimeType(ContentService.MimeType.JSON)
	}

	// Get the values of each row, remove the first row
	const rows = sheet.getDataRange().getValues()
	const headers = rows.shift()

	// Find the instructor with the same id
	const instructor = rows.find((row) => row[0] === targetId)

	if (!instructor) {
		return ContentService.createTextOutput(
			JSON.stringify({ error: 'Instructor not found!' })
		).setMimeType(ContentService.MimeType.JSON)
	}

	const instructorData = headers.reduce((obj, header, index) => {
		obj[header] = instructor[index]
		return obj
	}, {})

	// Return the data as JSON
	return ContentService.createTextOutput(JSON.stringify(instructorData)).setMimeType(
		ContentService.MimeType.JSON
	)
}

/* eslint-enable no-unused-vars */
