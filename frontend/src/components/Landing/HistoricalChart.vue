<template>
	<div class="main"></div>
</template>

<script>
import { getCountryData } from '../../../api'
export default {
	name: 'HistoricalChart',
	data: function() {
		return {
			countryList: []
		}
	},
	async mounted() {
		const data = await getCountryData()
		this.countryList = data.countryList
	}
}
</script>

<style lang="scss" scoped>
.main {
	margin-top: 2rem;
	height: 100%;
	background: rgba(0, 0, 0, 0.03);
	max-height: 600px;
}
</style>
