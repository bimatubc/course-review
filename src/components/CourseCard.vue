<template>
	<!-- Link to the course page using the course code -->
	<RouterLink :to="`/course/${course.code}`">
		<div
			class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<img
				class="rounded-t-lg justify-center items-center bg-red-600 h-48 w-full object-cover"
				src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDFq5wKktyhpmM9hOT06s-vEDuTaP_W_v0lw&s"
				alt=""
			/>

			<div class="p-5">
				<a href="#">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{{ formatted_code }}
					</h5>
				</a>
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
					{{ course.title }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
	course: {
		type: Object,
		default: () => ({
			id: '0',
			faculty: 'Unknown Faculty',
			code: 'Unknown Code',
			title: 'Unknown Title'
		}),
		required: true
	}
})

// Format the course code by adding a space between any letter followed by a number
// This is the only way I can think of to format the code lol
const formatted_code = computed(() => {
	return props.course.code.replace(/(\D)(\d)/, '$1 $2')
})
</script>

<style lang="scss" scoped></style>
