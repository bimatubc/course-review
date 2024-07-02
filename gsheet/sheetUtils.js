/* eslint-disable no-unused-vars */
/**
 * Function to get data from a specified sheet and return it as JSON
 * @param {String} sheetName - Name of the sheet
 * @return {JSON} - Data from the sheet encoded as JSON
 */
function getSheetData(sheetName) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)

	if (!sheet) {
		// Return error if the sheet is not found
		return ContentService.createTextOutput(
			JSON.stringify({ error: `Sheet ${sheetName} not found` })
		).setMimeType(ContentService.MimeType.JSON)
	}

	const data = sheet.getDataRange().getValues()
	const headers = data.shift()

	// Convert rows of data to objects with header keys
	const records = data.map((row) => {
		let record = {}
		for (const [index, header] of headers.entries()) {
			record[header] = row[index]
		}
		return record
	})

	// Return the data as JSON
	return ContentService.createTextOutput(JSON.stringify(records)).setMimeType(
		ContentService.MimeType.JSON
	)
}
/* eslint-enable no-unused-vars */
