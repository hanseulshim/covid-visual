<template>
  <div class="main">
    <svg class="chart" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getCountryData } from '../../../api'
export default {
  name: 'HistoricalChart',
  data() {
    return {
      countryList: []
    }
  },
  async mounted() {
    const data = await getCountryData()
    this.countryList = data.countryList
    this.renderChart()
  },
  methods: {
    renderChart() {
      const svg = d3.select('.chart')
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height
      const data = this.countryList

      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.positiveCases)])
        .range([height, 0])

      svg
        .append('g')
        .attr('transform', 'translate(0,50)')
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(['2020-05-10T04:00:00.000Z'])
            .tickFormat(d => new Date(d).getmon())
        )
      // svg.append('g').call(d3.axisLeft(yScale).ticks(10))

      svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.positiveCases))
        .attr('width', width / data.length)
        .attr('height', d => height - yScale(d.positiveCases))
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-top: 2rem;
  height: 100%;
  max-height: 600px;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
