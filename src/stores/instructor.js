import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_API_URL

// Schema definition for a single instructor
const instructorSchema = {
	type: 'object',
	properties: {
		id: { type: 'string', format: 'uuid' },
		name: { type: 'string' }
	},
	required: ['id', 'faculty']
}

// Schema definition for multiple instructors (array of instructors)
const multiInstructorSchema = {
	type: 'array',
	items: instructorSchema
}

const ajv = new Ajv()
addFormats(ajv)

const validateInstructor = ajv.compile(instructorSchema)
const validateMultiInstructor = ajv.compile(multiInstructorSchema)

export const useInstructorStore = defineStore({
	id: 'instructor', // Unique ID for the store
	state: () => ({
		instructor: null, // Holds data for a single instructor
		instructors: [], // Holds data for multiple instructor
		loading: false, // Indicates loading state
		error: null // Holds error messages
	}),
	getters: {
		//
	},
	actions: {
		async fetchInstructors() {
			this.instructors = []
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: { action: 'getInstructors' }
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateMultiInstructor(response.data)) {
					throw new Error('Invalid response format')
				}

				this.instructors = response.data.sort((a, b) => a.code.localeCompare(b.code))
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		},

		async fetchInstructorById(id) {
			this.instructor = null
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: {
						action: 'getInstructorById',
						targetId: id
					}
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateInstructor(response.data)) {
					throw new Error('Invalid response format')
				}

				this.instructor = response.data
			} catch (error) {
				this.error = error.message
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		}
	}
})
