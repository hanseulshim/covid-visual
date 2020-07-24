<template>
  <div class="main">
    <div class="tooltip">
      <div class="tooltip-row">
        <div class="title">Cases</div>
        <div class="label cases" />
      </div>
      <div class="tooltip-row">
        <div class="title">Risk Level</div>
        <div class="label risk-level" />
      </div>
      <div class="tooltip-arrow" />
    </div>
    <svg class="chart" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getCountryData } from '../../../api'
import { getRiskBackground } from '../../utils/risk'
import moment from 'moment'
export default {
  name: 'HistoricalChartMini',
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
      // const marginTop = 30
      const marginBottom = 75
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height - marginBottom
      const data = this.countryList
      const recentDay = data[data.length - 1]

      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.positiveCases)])
        .range([height, 0])

      const mouseover = d => {
        d3.select('.tooltip')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('background', getRiskBackground(d.riskScore))
        d3.select('.tooltip-arrow').style(
          'background',
          getRiskBackground(d.riskScore)
        )
        d3.select('.cases').text(d.positiveCases.toLocaleString())
        d3.select('.risk-level').text(d.riskScore)
      }

      const mousemove = d => {
        d3.select('.tooltip')
          .style('left', xScale(d.date) - 62 + 'px')
          .style('top', yScale(d.positiveCases) - 20 + 'px')
      }

      const resetTooltip = () => {
        mouseover(recentDay)
        mousemove(recentDay)
      }

      resetTooltip()

      // AXIS LINE
      svg
        .append('g')
        .attr('transform', `translate(0, ${height + 50})`)
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

      // BAR CHARTS
      svg
        .append('g')
        .attr('transform', `translate(0, 50)`)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.positiveCases))
        .attr('width', width / data.length)
        .attr('height', d => height - yScale(d.positiveCases))
        .attr('stroke', '#FFF')
        .attr('fill', d => getRiskBackground(d.riskScore))
        .on('mouseover', mouseover)
        .on('mouseout', () => {
          resetTooltip()
        })
        .on('mousemove', mousemove)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  max-height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .next-icon {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .chart {
    width: 100%;
    height: 100%;
  }
  .tooltip {
    position: absolute;
    padding: 0.5rem;
    color: #fff;
    border-radius: 6px;
    width: 120px;
    opacity: 0;

    .tooltip-arrow {
      position: absolute;
      width: 10px;
      height: 10px;
      top: calc(100% - 5px);
      left: calc(50% - 8px);
      transform: rotate(45deg);
    }

    .tooltip-row {
      display: flex;
      justify-content: space-between;
      line-height: 1.25rem;
      .label {
        font-weight: bold;
      }
    }
  }
}
</style>
