<template>
	<div class="flex flex-col bg-white">
		<main class="flex flex-col pt-4 px-20 w-full max-md:px-5 max-md:max-w-full">
			<!-- Loading and error messages for course data -->
			<p v-if="courseStore.loading">Loading course information....</p>
			<p v-else-if="courseError">{{ courseError.message }}</p>

			<!-- Display course details if available -->
			<section v-else-if="course" class="max-md:max-w-full">
				<div class="flex gap-5 max-md:flex-col max-md:gap-0">
					<div class="flex flex-col w-[56%] max-md:ml-0 max-md:w-full items-center justify-center">
						<img
							loading="lazy"
							src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDFq5wKktyhpmM9hOT06s-vEDuTaP_W_v0lw&s"
							alt="imge"
							class="w-60 h-60 items-center justify-center rounded-lg"
						/>
					</div>

					<div class="flex flex-col ml-5 w-[44%] max-md:ml-0 max-md:w-full">
						<div
							class="flex flex-col justify-center font-medium leading-[150%] text-zinc-500 max-md:mt-10 max-md:max-w-full"
						>
							<h2 class="text-4xl font-semibold leading-10 text-black max-md:max-w-full">
								{{ formattedCode }}
							</h2>
							<p class="mt-2 text-xl font-semibold max-md:max-w-full">
								{{ course.title }}
							</p>

							<!-- Display average difficulty and workload ratings -->
							<div v-if="averageDifficulty !== null">
								<p>Difficulty</p>
								<IconRating
									:rating="averageDifficulty"
									svgPath="M17.71,7.29a1,1,0,0,0-1-.25,1,1,0,0,0-.7.73,4.37,4.37,0,0,1-.45,1.13,10.89,10.89,0,0,0-5-6.73A1,1,0,0,0,9,3,7.1,7.1,0,0,1,6.6,8.38C5.38,9.71,4,11.22,4,14c0,5,3,8,8,8s8-2.91,8-8C20,12,19,8.58,17.71,7.29Z"
								/>
							</div>

							<div v-if="averageDifficulty !== null">
								<p>Workload</p>
								<IconRating
									:rating="averageWorkload"
									svgPath="M20 18v-4h-3v1h-2v-1H9v1H7v-1H4v4h16M6.33 8l-1.74 4H7v-1h2v1h6v-1h2v1h2.41l-1.74-4H6.33M9 5v1h6V5H9m12.84 7.61c.1.22.16.48.16.8V18c0 .53-.21 1-.6 1.41c-.4.4-.85.59-1.4.59H4c-.55 0-1-.19-1.4-.59C2.21 19 2 18.53 2 18v-4.59c0-.32.06-.58.16-.8L4.5 7.22C4.84 6.41 5.45 6 6.33 6H7V5c0-.55.18-1 .57-1.41C7.96 3.2 8.44 3 9 3h6c.56 0 1.04.2 1.43.59c.39.41.57.86.57 1.41v1h.67c.88 0 1.49.41 1.83 1.22l2.34 5.39z"
								/>
							</div>

							<button
								class="justify-center items-center px-6 py-3.5 mt-6 text-base text-white bg-gradient-to-r to-emerald-600 from-sky-400 rounded-lg shadow-sm max-md:px-5 max-md:max-w-full"
								@click="openReviewForm"
							>
								Submit a review
							</button>
						</div>
					</div>
				</div>
			</section>

			<p v-if="!course">Waiting for course to be loaded...</p>
			<p v-else-if="reviewStore.loading">Loading reviews...</p>
			<p v-else-if="reviewError">{{ reviewError.message }}</p>

			<section v-else-if="reviews" class="mt-20 max-md:mt-10 max-md:max-w-full">
				<h3
					class="text-2xl leading-9 font-medium text-slate-700 text-center mb-10 border-b-[1px] p-4"
				>
					See what other students have to say
				</h3>

				<div
					v-for="review in reviews"
					:key="review.id"
					class="mt-4 max-md:max-w-full space-y-6 mb-20"
				>
					<ReviewCard :review="review" />
				</div>
			</section>
		</main>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { useReviewStore } from '@/stores/review'

import IconRating from '@/components/IconRating.vue'
import ReviewCard from '@/components/ReviewCard.vue'

const route = useRoute()
const courseStore = useCourseStore()
const reviewStore = useReviewStore()

const courseError = ref(null)
const reviewError = ref(null)

// Computed properties to get course and reviews from their respective stores
const course = computed(() => courseStore.course)
const reviews = computed(() => reviewStore.reviews)

// Fetch course details by course code
const fetchCourseByCode = async (courseCode) => {
	courseError.value = null
	try {
		await courseStore.fetchCourseByCode(courseCode)
	} catch (err) {
		courseError.value = err
	}
}

// Fetch reviews by course ID
const fetchReviewsById = async (courseId) => {
	reviewError.value = null
	try {
		await reviewStore.fetchReviewsById({ courseId: courseId })
	} catch (err) {
		reviewError.value = err
	}
}

// Format course code for display
const formattedCode = computed(() => {
	return course?.value?.code.replace(/(\D)(\d)/, '$1 $2')
})

// Compute average difficulty rating
const averageDifficulty = computed(() => {
	if (!reviews.value.length) return null
	const totalDifficulty = reviews.value.reduce((acc, review) => acc + review.difficulties, 0)
	return totalDifficulty / reviews.value.length
})

// Compute average workload
const averageWorkload = computed(() => {
	if (!reviews.value.length) return null
	const totalWorkload = reviews.value.reduce((acc, review) => acc + review.workload, 0)
	return totalWorkload / reviews.value.length
})

const openReviewForm = () => {
	const url = 'https://forms.gle/8sSfxZrQTLRvx1zz7'
	window.open(url, '_blank')
}

// Watcher to fetch reviews when the course is loaded
watch(
	course,
	(loadedCourse) => {
		if (loadedCourse) {
			fetchReviewsById(loadedCourse.id)
		}
	},
	{ immediate: true }
)

onMounted(() => {
	fetchCourseByCode(route.params.code)
})
</script>

<style></style>
