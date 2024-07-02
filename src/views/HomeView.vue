<template>
	<main>
		<!-- Header Section -->
		<div
			className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl  text-center items-center content-center justify-center bg-red-200 flex flex-col"
		>
			<span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
				BIM at UBC
			</span>
			<div className="lg:text-xl md:text-lg text-base font-semibold text-gray-700">
				Course <span className="italic underline font-bold text-cyan-500">Review</span>
			</div>
		</div>

		<!-- Search Form -->
		<div>
			<form action="" class="main-search">
				<input
					v-model="searchQuery"
					id="search-course"
					type="text"
					name="search-course"
					placeholder="Search course code"
					class="main-search-text"
				/>
			</form>
		</div>

		<!-- Loading and Error messages -->
		<p v-if="loading">Loading...</p>
		<p v-if="error">
			{{ error.message }}
		</p>

		<div v-else>
			<!-- Courses grid -->
			<div
				className="w-full flex  justify-center items-center relative "
				v-if="filteredCourses.length !== 0"
			>
				<div className="items-center justify-center flex">
					<div
						class="md:grid md:grid-cols-3 gap-3 md:w-5/6 w-full space-y-4 md:space-y-0 justify-center items-center"
					>
						<div class="max-w-sm block" v-for="course in filteredCourses" :key="course.id">
							<CourseCard :course="course" />
						</div>
					</div>
				</div>
			</div>

			<p v-else>No courses found matching your search criteria</p>
		</div>
	</main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/CourseCard.vue'

const courseStore = useCourseStore()

// Desctructuring courses and loading state from the store
const { courses, loading } = storeToRefs(courseStore)

const error = ref(null)
const searchQuery = ref('')

const fetchCourses = async () => {
	error.value = null
	try {
		await courseStore.fetchCourses()
	} catch (err) {
		error.value = err
	}
}

// Filter courses based on search query
const filteredCourses = computed(() => {
	if (!searchQuery.value) return courses.value
	let filterResult = courses.value.filter((course) => {
		return course.code.includes(searchQuery.value.toUpperCase()) // Course codes are already in upper case
	})
	return filterResult
})

onMounted(() => {
	fetchCourses()
})
</script>

<style lang="scss" scoped>
.main-search-text {
	border: 1px solid #e5e7eb;
}
</style>
