<template>
	<div id="app" v-scroll="handleScroll">
		<Landing />
		<RiskLevel />
	</div>
</template>

<script>
import Landing from './components/Landing'
import RiskLevel from './components/RiskLevel'

export default {
	name: 'App',
	data: function() {
		return {
			show: false
		}
	},
	components: {
		Landing,
		RiskLevel
	},
	methods: {
		handleScroll: function() {
			console.log(window.scrollY)
			if (window.scrollY > 25) {
				this.show = true
				window.setTimeout(() => {
					window.scrollTo(0, 300)
				}, 50)
			}
			return window.scrollY > 25
		}
	}
}
</script>

<style lang="scss">
body {
	margin: 0;
	padding: 0;
}
#app {
	font-family: Helvetica Neue LT Pro, Helvetica, Arial, sans-serif;
	font-style: normal;
	font-size: 16px;
	line-height: 16px;
	height: 100vh;
}
</style>
