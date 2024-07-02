import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'
import { defineStore } from 'pinia'
import { isObjectEmpty } from '@/utils'

const API_URL = import.meta.env.VITE_API_URL

// Schema definition for a single review
const reviewSchema = {
	type: 'object',
	properties: {
		id: { type: 'string', format: 'uuid' },
		user_id: { type: 'string', format: 'uuid' },
		course_id: { type: 'string', format: 'uuid' },
		instructor_id: { type: 'string', format: 'uuid' },
		reviewer_faculty: { type: 'string' },
		reviewer_standing: { type: 'string' },
		instructor_name: { type: 'string' },
		instructor_rating: { type: 'integer' },
		workload: { type: 'integer' },
		difficulties: { type: 'integer' },
		recommended: { type: 'string', enum: ['Yes', 'No', 'Maybe'] },
		description: { type: 'string' },
		tips: { type: 'string' },
		timestamp: { type: 'string', format: 'date-time' }
	},
	required: [
		'id',
		'user_id',
		'course_id',
		'instructor_id',
		'reviewer_faculty',
		'reviewer_standing',
		'instructor_name',
		'instructor_rating',
		'workload',
		'difficulties',
		'recommended',
		'description',
		'tips',
		'timestamp'
	]
}

// Schema definition for multiple reviews
const multiReviewSchema = {
	type: 'array',
	items: reviewSchema
}

const ajv = new Ajv()
addFormats(ajv)

const validateMultiReview = ajv.compile(multiReviewSchema)

// Utility function to create a validation function for multiple reviews
function sortReviewsByDate(reviews) {
	return reviews.slice().sort((a, b) => {
		// Convert timestamp into Date object
		const dateA = new Date(a.timestamp)
		const dateB = new Date(b.timestamp)

		// Sort from newest to oldest
		return dateB - dateA
	})
}

export const useReviewStore = defineStore({
	id: 'review', // Unique ID for the store
	state: () => ({
		reviews: [], // Holds data for multiple reviews
		loading: false, // Indicates loading state
		error: null // Holds error messages
	}),
	getters: {
		//
	},
	actions: {
		async fetchReviews() {
			this.reviews = []
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: { action: 'getReviews' }
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the rseponse data against the schema
				if (!validateMultiReview(response.data)) {
					throw new Error('Invalid response format')
				}

				this.reviews = sortReviewsByDate(response.data)
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Can return multiple reviews
		async fetchReviewsById(params) {
			this.reviews = []
			this.loading = true
			this.error = null

			try {
				if (isObjectEmpty(params)) {
					throw new Error('ID is empty!')
				}

				const response = await axios.get(API_URL, {
					params: {
						action: 'getReviewsById',
						...params
					}
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateMultiReview(response.data)) {
					throw new Error('Invalid response format')
				}

				this.reviews = sortReviewsByDate(response.data)
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		}
	}
})
