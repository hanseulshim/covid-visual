<template>
  <div class="main">
    <div class="tooltip">
      <div class="tooltip-row">
        <div class="title">Date</div>
        <div class="label date" />
      </div>
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
    <router-link :to="'detail'">
      <svg
        class="next-icon"
        x="0px"
        y="0px"
        viewBox="0 0 480 480"
        fill="#4A4A4A"
      >
        <g>
          <g>
            <g>
              <path
                d="M240,0C107.452,0,0,107.452,0,240s107.452,240,240,240c132.486-0.15,239.85-107.514,240-240C480,107.452,372.548,0,240,0
				z M240,464C116.288,464,16,363.712,16,240S116.288,16,240,16c123.653,0.141,223.859,100.347,224,224
				C464,363.712,363.712,464,240,464z"
              />
              <path
                d="M370.112,170.576L240,300.688L109.888,170.576c-3.1-2.994-8.015-2.994-11.115,0c-3.178,3.069-3.266,8.134-0.197,11.312
				l135.768,135.768c1.5,1.5,3.534,2.344,5.656,2.344c2.122,0,4.156-0.844,5.656-2.344l135.768-135.768
				c0.067-0.064,0.132-0.13,0.196-0.196c3.069-3.178,2.982-8.242-0.196-11.312C378.246,167.31,373.182,167.398,370.112,170.576z"
              />
            </g>
          </g>
        </g>
      </svg>
    </router-link>
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
      const marginBottom = 50
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height - marginBottom
      const data = this.countryList
      const recentDay = data[data.length - 1]
      const minDay = this.relativeMin

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
        d3.select('.date').text(moment(d.date, 'MM-DD-YYYY').format('MMMM Do'))
        d3.select('.cases').text(d.positiveCases.toLocaleString())
        d3.select('.risk-level').text(d.riskScore)
      }
      const mousemove = d => {
        d3.select('.tooltip')
          .style('left', xScale(d.date) - 70 + 'px')
          .style('top', yScale(d.positiveCases) - 110 + 'px')
      }

      const resetTooltip = () => {
        mouseover(recentDay)
        mousemove(recentDay)
      }

      resetTooltip()

      // AXIS LINE
      svg
        .append('g')
        .attr('transform', `translate(0, ${height + 10})`)
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
      svg
        .append('rect')
        .attr('width', width)
        .attr('y', yScale(recentDay.positiveCases))
        .attr(
          'height',
          Math.abs(
            yScale(recentDay.positiveCases) - yScale(minDay.positiveCases)
          )
        )
        .attr('fill', '#000')
        .attr('fill-opacity', 0.03)

      // BAR CHARTS
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
        .attr('stroke', '#FFF')
        .attr('fill', d => getRiskBackground(d.riskScore))
        .on('mouseover', mouseover)
        .on('mouseout', function() {
          resetTooltip()
        })
        .on('mousemove', mousemove)

      // DASHED LINES
      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(recentDay.positiveCases))
        .attr('y2', yScale(recentDay.positiveCases))
        .attr('stroke', '#000')
        .attr('stroke-dasharray', 3)
      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(minDay.positiveCases))
        .attr('y2', yScale(minDay.positiveCases))
        .attr('stroke', '#000')
        .attr('stroke-dasharray', 3)

      // TEXT
      svg
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
      svg
        .append('text')
        .attr('x', '2rem')
        .attr('y', yScale(recentDay.positiveCases) + 100)
        .text(`since ${moment(minDay.date, 'MM-DD-YYYY').format('MMMM Do')},`)
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

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
    padding: 1rem;
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
