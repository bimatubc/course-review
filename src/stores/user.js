import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_API_URL

// Schema definition for a single user
const userSchema = {
	type: 'object',
	properties: {
		id: { type: 'string', format: 'uuid' },
		name: { type: 'string' },
		email: { type: 'string', format: 'email' }
	},
	required: ['id', 'name', 'email']
}

// Schema definition for multiple users
const multiUserSchema = {
	type: 'array',
	items: userSchema
}

const ajv = new Ajv()
addFormats(ajv)

const validateUser = ajv.compile(userSchema)
const validateMultiUser = ajv.compile(multiUserSchema)

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		user: null, // Hold data for a single user
		users: [], // Holds data for multiple users
		loading: false, // Indicate loading state
		error: null // Holds error messages
	}),
	getters: {
		//
	},
	actions: {
		async fetchUsers() {
			this.users = []
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: { action: 'getUsers' }
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateMultiUser(response.data)) {
					throw new Error('Invalid response format')
				}

				this.users = response.data.sort((a, b) => a.name.localeCompare(b.name))
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		},

		async fetchUserById(id) {
			this.user = null
			this.loading = true
			this.error = null

			try {
				const response = await axios.get(API_URL, {
					params: {
						action: 'getUserById',
						targetId: id
					}
				})

				// Check if the api call returns an error
				if (response.data.error) {
					throw new Error(response.data.error)
				}

				// Validate the response data against the schema
				if (!validateUser(response.data)) {
					throw new Error('Invalid response format')
				}

				this.user = response.data
			} catch (error) {
				this.error = error.message || 'An error occured'
				throw { status: error.status || 500, message: this.error }
			} finally {
				this.loading = false
			}
		}
	}
})
