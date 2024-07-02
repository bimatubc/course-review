<template>
	<div class="bg-white rounded-lg shadow-lg dark:bg-gray-100">
		<div class="p-5 flex">
			<!-- Main content area -->
			<div class="w-9/12 mr-3">
				<!-- Instructor information and rating -->
				<div class="flex">
					<div class="w-3/12">
						<a href="#">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
								{{ review.instructor_name }}
							</h5>
						</a>
						<!-- Rating component for the instructor -->
						<IconRating
							:rating="review.instructor_rating"
							svgPath="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
						/>
					</div>
					<!-- Review details -->
					<div class="mt-1 w-2/12 font-semibold">Difficulty: {{ review.difficulties }}</div>
					<div class="mt-1 w-2/12 font-semibold">Workload: {{ review.workload }}</div>
					<div class="mt-1 w-2/12 font-semibold">Recommended: {{ review.recommended }}</div>
				</div>
				<hr class="mt-2 mb-2" />

				<!-- Course description -->
				<h1>About the course:</h1>
				<div class="mb-3 font-normal text-gray-700 dark:text-gray-700" v-html="renderedDesc"></div>

				<!-- Tips for excellign-->
				<h1>Tips to excel:</h1>
				<div class="mb-3 font-normal text-gray-700 dark:text-gray-700" v-html="renderedTips"></div>
			</div>

			<!-- Reviewer information -->
			<div>
				<div class="object-center">
					<h5 class="font-bold text-gray-900 mb-2 text-xl">Reviewer Info:</h5>
					<div>
						<!-- Reviewer information table -->
						<table class="flex-col">
							<tr>
								<td>Faculty</td>
								<td>:</td>
								<td>{{ review.reviewer_faculty }}</td>
							</tr>
							<tr>
								<td>Standing</td>
								<td>:</td>
								<td>{{ review.reviewer_standing }}</td>
							</tr>
							<tr>
								<td>Date of review</td>
								<td>:</td>
								<td>{{ review.timestamp }}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

import IconRating from '@/components/IconRating.vue'

const props = defineProps({
	review: {
		type: Object,
		default: () => ({
			id: '0',
			user_id: '0',
			course_id: '0',
			instructor_id: '0',
			instructor_name: 'Unknown Instructor',
			reviewer_faculty: 'Unknown Faculty',
			reviewer_standing: 'Unknown Standing',
			instructor_rating: 1,
			workload: 1,
			difficulties: 1,
			recommended: 'Yes',
			description: 'No description',
			tips: 'No tips',
			timestamp: '-'
		})
	}
})

/**
 * Compute the formatted description by replacing newlines with <br> tags
 */
const renderedDesc = computed(() => {
	let formatted = props.review.description.replace(/\n/g, '<br>')
	return `<p>${formatted}</p>`
})

/**
 * Compute the formatted tips by replacing newlines with <br> tags
 */
const renderedTips = computed(() => {
	let formatted = props.review.tips.replace(/\n/g, '<br>')
	return `<p>${formatted}</p>`
})
</script>
