<template>
  <div class="main">
    <svg class="chart" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getCountryData } from '../../../api'
import { getRiskBackground } from '../../utils/risk'
import moment from 'moment'
export default {
  name: 'HistoricalChart',
  data() {
    return {
      countryList: [],
      percentDifference: 0,
      relativeMin: {}
    }
  },
  async mounted() {
    const data = await getCountryData()
    this.countryList = data.countryList
    this.percentDifference = data.percentDifference
    this.relativeMin = data.relativeMin
    this.renderChart()
  },
  methods: {
    renderChart() {
      const svg = d3.select('.chart')
      const marginTop = 50
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height
      const data = this.countryList
      const recentDay = data[data.length - 1]
      const minDay = this.relativeMin
      const chart = svg
        .append('g')
        .attr('transform', `translate(0, ${marginTop})`)

      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.positiveCases)])
        .range([height - marginTop, 0])

      // AXIS LINE
      svg
        .append('g')
        .call(
          d3
            .axisBottom(xScale)
            .tickValues([
              ...new Set(
                data
                  .filter(day => day.date.split('-')[1] === '01')
                  .map(day =>
                    moment(day.date, 'MM-DD-YYYY').format('MM-DD-YYYY')
                  )
              )
            ])
            .tickSize(0)
            .tickFormat(d => moment(d, 'MM-DD-YYYY').format('MMMM'))
        )
        .attr('opacity', 0.3)
        .attr('font-size', '1rem')
        .select('.domain')
        .remove()

      // RECTANGLE
      chart
        .append('rect')
        .attr('width', width)
        .attr('y', yScale(recentDay.positiveCases))
        .attr(
          'height',
          Math.abs(
            yScale(recentDay.positiveCases) - yScale(minDay.positiveCases)
          )
        )
        .style('fill', '#000')
        .style('fill-opacity', 0.03)

      // BAR CHARTS
      chart
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.positiveCases))
        .attr('width', width / data.length)
        .attr('height', d => height - yScale(d.positiveCases))
        // .style('stroke', '#FFF')
        .style('fill', d => getRiskBackground(d.riskScore))

      // DASHED LINES
      chart
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(recentDay.positiveCases))
        .attr('y2', yScale(recentDay.positiveCases))
        .attr('stroke', '#000')
        .attr('stroke-dasharray', 3)
      chart
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(minDay.positiveCases))
        .attr('y2', yScale(minDay.positiveCases))
        .attr('stroke', '#000')
        .attr('stroke-dasharray', 3)

      // TEXT
      chart
        .append('text')
        .attr('x', '2rem')
        .attr('y', yScale(recentDay.positiveCases) + 60)
        .text(
          `${Math.round(this.percentDifference * 100)}% ${
            this.percentDifference > 0 ? 'Increase' : 'Decrease'
          } in Daily Cases`
        )
        .attr('font-size', '2.5rem')
        .attr('font-weight', 250)
      chart
        .append('text')
        .attr('x', '2rem')
        .attr('y', yScale(recentDay.positiveCases) + 100)
        .text(
          `since ${moment(recentDay.date, 'MM-DD-YYYY').format('MMMM Do')},`
        )
        .attr('font-size', '1.5rem')
        .attr('font-weight', 'bold')
        .append('tspan')
        .text(' when daily cases were lowest')
        .attr('font-weight', 250)
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
