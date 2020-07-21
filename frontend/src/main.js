import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Landing from './components/Landing'
import Detail from './components/Detail'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{ path: '/', component: Landing, name: 'landing' },
		{ path: '/detail', component: Detail, name: 'detail' }
	]
})

Vue.directive('scroll', {
	inserted: (el, binding) => {
		const f = (evt) => {
			if (binding.value(evt, el)) {
				window.removeEventListener('scroll', f)
			}
		}
		window.addEventListener('scroll', f)
	}
})

new Vue({
	render: (h) => h(App),
	router
}).$mount('#app')
