import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('@/views/HomeView.vue')
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/AboutView.vue')
		},
		{
			path: '/course/:code',
			name: 'course',
			component: () => import('@/views/CourseView.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('@/views/PageNotFoundView.vue')
		}
	]
})

export default router
