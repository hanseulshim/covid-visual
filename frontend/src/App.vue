<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'App'
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
	.fade-enter-active,
	.fade-leave-active {
		transition-duration: 0.2s;
		transition-property: opacity;
		transition-timing-function: ease;
	}
	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
}
</style>
