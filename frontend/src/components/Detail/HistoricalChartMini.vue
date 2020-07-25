<template>
  <div class="main">
    <div class="country">United States</div>
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
    <input
      type="range"
      min="0"
      :max="countryList.length - 1"
      v-model="index"
      class="slider"
      @change="changeDate"
    />
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
      relativeMin: {},
      index: 0,
      marginBottom: 90
    }
  },
  async mounted() {
    const data = await getCountryData()
    this.countryList = data.countryList
    this.percentDifference = data.percentDifference
    this.relativeMin = data.relativeMin
    this.index = data.countryList.length - 1
    this.$emit(
      'selectedDate',
      data.countryList[data.countryList.length - 1].date
    )
    this.renderChart()
  },
  computed: {
    currentDay() {
      return this.countryList[this.index]
    },
    width() {
      return d3
        .select('.chart')
        .node()
        .getBoundingClientRect().width
    },
    height() {
      return (
        d3
          .select('.chart')
          .node()
          .getBoundingClientRect().height - this.marginBottom
      )
    },
    xScale() {
      return d3
        .scaleBand()
        .domain(this.countryList.map(d => d.date))
        .range([0, this.width])
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.countryList, d => d.positiveCases)])
        .range([this.height, 0])
    }
  },
  methods: {
    renderChart() {
      const svg = d3.select('.chart')
      const data = this.countryList
      const recentDay = data[data.length - 1]

      this.setTooltip(recentDay)

      // SLIDER
      d3.select('.slider').style('top', this.height + 52 + 'px')

      // AXIS LINE
      svg
        .append('g')
        .attr('transform', `translate(0, ${this.height + 73})`)
        .call(
          d3
            .axisBottom(this.xScale)
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
        .attr('x', d => this.xScale(d.date))
        .attr('y', d => this.yScale(d.positiveCases))
        .attr('width', this.width / data.length)
        .attr('height', d => this.height - this.yScale(d.positiveCases))
        .attr('stroke', '#FFF')
        .attr('fill', d => getRiskBackground(d.riskScore))
    },
    changeDate() {
      this.$emit('selectedDate', this.currentDay.date)
    },
    mouseover(d) {
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
    },
    mousemove(d) {
      d3.select('.tooltip')
        .style('left', this.xScale(d.date) - 62 + 'px')
        .style('top', this.yScale(d.positiveCases) - 35 + 'px')
    },
    setTooltip(d) {
      this.mouseover(d)
      this.mousemove(d)
    }
  },
  watch: {
    index() {
      this.setTooltip(this.countryList[this.index])
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

  .country {
    position: absolute;
    left: 0;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  .slider {
    position: absolute;
    -webkit-appearance: none;
    appearance: none;
    width: calc(100% + 10px);
    height: 10px;
    border-radius: 15px;
    outline: none;
    background: #eeeeee;
    border: 1px solid #aaaaaa;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #666666;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #666666;
      cursor: pointer;
    }
  }

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
