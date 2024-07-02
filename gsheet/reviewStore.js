/* Database Structure
 * review: {
 *     id: UUID
 *     user_id: UUID
 *     course_id: UUID
 *     instructor_id: UUID
 *     reviewer_faculty: String
 *     reviewer_standing: String
 *     instructor_name: String
 *     instructor_rating: Integer
 *     workload: Integer
 *     difficulty: Integer
 *     recommended: String
 *     description: String
 *     tips: String
 *     timestamp: Timestamp
 * }
 */

/* eslint-disable no-unused-vars */

/**
 * Append a new review to the Review sheet
 * @param {Object} data - The review data to be appended
 */
function appendNewReview(data) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.REVIEWS)
	const rows = sheet.getDataRange().getValues()

	// Check if the review already exists
	const existingReview = rows.find(
		(row) =>
			row[0] === data.id &&
			row[1] === data.user_id &&
			row[2] === data.course_id &&
			row[3] === data.instructor_id
	)

	if (existingReview) {
		data.id = existingReview[0]
		Logger.log('Review already exists with the same ID, user, course, and instructor')
	} else {
		data.id = generateUUID()

		// Deconstruct data to make sure everything is in the correct order
		const newReview = [
			data.id,
			data.user_id,
			data.course_id,
			data.instructor_id,
			data.reviewer_faculty,
			data.reviewer_standing,
			data.instructor_name,
			data.instructor_rating,
			data.workload,
			data.difficulty,
			data.recommended,
			data.description,
			data.tips,
			data.timestamp
		]

		// Append new review to the Reviews sheet
		sheet.appendRow(newReview)
		Logger.log('Inserted new review data into Reviews sheet')
	}
}

// Wrapper function to get all reviews
function getReviews() {
	return getSheetData('Reviews')
}

/**
 * Function to get review by review_id, user_id, course_id, or instructor_id
 * @params {Object} params -  an object containing review_id, user_id, course_id, and instructor_id
 */
function getReviewsById(params) {
	Logger.log('Searching for reviews by ID:')
	Logger.log(params)
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.REVIEWS)

	if (!sheet) {
		Logger.log('REVIEWS SHEET NOT FOUND!!')
		// Return error if review sheet is not found
		return ContentService.createTextOutput(
			JSON.stringify({
				error:
					'Review sheet not found!\nThis is not an intended behaviour, please inform the developers immediately!'
			})
		).setMimeType(ContentService.MimeType.JSON)
	}

	// Check if params is empty, return error if it is
	if (isObjectEmpty(params)) {
		return ContentService.createTextOutput(
			JSON.stringify({
				error: 'Request contains no IDs!!'
			})
		).setMimeType(ContentService.MimeType.JSON)
	}

	const rows = sheet.getDataRange().getValues()
	const headers = rows.shift()

	const indexMap = {
		id: 0,
		user_id: 1,
		course_id: 2,
		instructor_id: 3
	}

	const matchingReviews = rows.filter((row) => {
		return Object.entries(params).every(([key, value]) => row[indexMap[key]] === value)
	})

	if (matchingReviews.length === 0) {
		return ContentService.createTextOutput(
			JSON.stringify({ error: 'No reviews found!' })
		).setMimeType(ContentService.MimeType.JSON)
	}

	const reviews = matchingReviews.map((reviewRow) => {
		return headers.reduce((obj, header, index) => {
			obj[header] = reviewRow[index]
			return obj
		}, {})
	})

	return ContentService.createTextOutput(JSON.stringify(reviews)).setMimeType(
		ContentService.MimeType.JSON
	)
}

/* eslint-enable no-unused-vars */
