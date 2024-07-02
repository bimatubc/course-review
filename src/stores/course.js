import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_API_URL

// Schema definition for a single course
const courseSchema = {
	type: 'object',
	properties: {
		id: { type: 'string', format: 'uuid' },
		faculty: { type: 'string' },
		code: { type: 'string' },
		title: { type: 'string' }
	},
	required: ['id', 'faculty', 'code', 'title']
}

// Schema definition for multiple courses (array of courses)
const multiCourseSchema = {
	type: 'array',
	items: courseSchema
}

const ajv = new Ajv()
addFormats(ajv)

const validateCourse = ajv.compile(courseSchema)
const validateMultiCourse = ajv.compile(multiCourseSchema)

export const useCourseStore = defineStore({
	id: 'course', // Unique ID for the store
	state: () => ({
		course: null, // Holds data for a single course
		courses: [], // Holds data for multiple courses
		loading: false, // Indicates loading state
		error: null // Holds error messages
	}),
	getters: {
		//
	},
	actions: {
		async fetchCourses() {
			this.courses = []
			this.loading = true
			this.error = null

			console.log(API_URL)

			try {
				const response = await axios.get(API_URL, {
					params: { action: 'getCourses' }
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateMultiCourse(response.data)) {
					throw new Error('Invalid response format')
				}

				this.courses = response.data.sort((a, b) => a.code.localeCompare(b.code))
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.message || 500, message: this.error }
			} finally {
				this.loading = false
			}
		},

		async fetchCourseById(id) {
			this.course = null
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: {
						action: 'getCourseById',
						targetId: id
					}
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateCourse(response.data)) {
					throw new Error('Invalid response format')
				}

				this.course = response.data
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		},

		async fetchCourseByCode(code) {
			this.course = null
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: {
						action: 'getCourseByCode',
						targetCode: code
					}
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateCourse(response.data)) {
					throw new Error('Invalid response format')
				}

				this.course = response.data
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		}
	}
})
