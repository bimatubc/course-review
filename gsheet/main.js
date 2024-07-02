/* eslint-disable no-unused-vars */
/**
 * Function to handle get requests
 * @param {object} e - Event given by the request
 */
function doGet(e) {
	const action = e.parameter.action
	switch (action) {
		case 'getSheetData': {
			const sheet_name = e.parameter.sheetName
			return getSheetData(sheet_name)
		}
		case 'getUsers': {
			return getUsers()
		}
		case 'getUserById': {
			const targetId = e.parameter.targetId
			return getUserById(targetId)
		}
		case 'getCourses': {
			return getCourses()
		}
		case 'getCourseById': {
			const targetId = e.parameter.targetId
			return getCourseById(targetId)
		}
		case 'getCourseByCode': {
			const targetCode = e.parameter.targetCode
			return getCourseByCode(targetCode)
		}
		case 'getInstructors': {
			return getInstructors()
		}
		case 'getInstructorById': {
			const targetId = e.parameter.targetId
			return getInstructorById(targetId)
		}
		case 'getReviews': {
			return getReviews()
		}
		case 'getReviewsById': {
			let params = {}
			if (e.parameter.id) params.id = e.parameter.id
			if (e.parameter.userId) params.user_id = e.parameter.userId
			if (e.parameter.courseId) params.course_id = e.parameter.courseId
			if (e.parameter.instructorId) params.instructor_id = e.parameter.instructorId
			return getReviewsById(params)
		}
		default: {
			return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
		}
	}
}

/**
 * Trigger on form submission
 * @param {object} e - Event triggered by form submission
 */
function onFormSubmit(e) {
	const responses = e.values

	const timestamp = responses[0]
	const course_faculty = responses[1]

	// The following course code are enforced by the rule: ^[A-Za-z]{3,4} ?\d{3} ?[A-Za-z]?$
	const course_code = responses[2].replaceAll(' ', '').toUpperCase() // Clean up course code
	const course_title = responses[3]

	const reviewer_name = responses[4]
	const reviewer_faculty = responses[5]
	const reviewer_standing = responses[6]
	const instructor_name = responses[7]
	const instructor_rating = responses[8]
	const workload = responses[9]
	const difficulty = responses[10]
	const recommended = responses[11]
	const description = responses[12]
	const tips = responses[13]
	const reviewer_email = responses[14]

	// Insert into Users sheet
	let user_obj = { id: null, name: reviewer_name, email: reviewer_email }
	appendNewUser(user_obj)

	// Insert into Courses sheet
	let course_obj = { id: null, faculty: course_faculty, code: course_code, title: course_title }
	appendNewCourse(course_obj)

	// Insert into Instructors sheet
	let instructor_obj = { id: null, name: instructor_name }
	appendNewInstructor(instructor_obj)

	// Insert into Reviews sheet
	let review_obj = {
		id: null,
		user_id: user_obj.id,
		course_id: course_obj.id,
		instructor_id: instructor_obj.id,
		reviewer_faculty: reviewer_faculty,
		reviewer_standing: reviewer_standing,
		instructor_name: instructor_name,
		instructor_rating: instructor_rating,
		workload: workload,
		difficulty: difficulty,
		recommended: recommended,
		description: description,
		tips: tips,
		timestamp: timestamp
	}
	appendNewReview(review_obj)
}
/* eslint-enable no-unused-vars */
