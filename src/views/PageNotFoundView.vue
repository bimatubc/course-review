<template>
	<main>
		<div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
			<div class="text-center">
				<h1
					class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600 mb-4"
				>
					404
				</h1>
				<h2 class="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
				<p class="text-gray-600 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<router-link
					to="/"
					class="px-6 py-3 text-white bg-gradient-to-r from-sky-400 to-emerald-600 rounded-lg shadow-md hover:from-sky-500 hover:to-emerald-700"
				>
					Back to Home
				</router-link>
			</div>
		</div>
	</main>
</template>
