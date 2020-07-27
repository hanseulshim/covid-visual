<template>
  <div class="container">
    <div class="header">
      <div class="title">
        <h2>The 6 levels of threat across the U.S.</h2>
        <h3>Over the past 14 days</h3>
      </div>
      <div class="risk-level">
        <span class="score">{{ currentDay.riskScore }}</span>
        <div>
          <span class="description">Risk Level</span>
          <span>{{ dateString }}</span>
        </div>
      </div>
    </div>
    <div class="charts-container">
      <div
        v-for="(trend, index) in trends"
        v-bind:key="index"
        class="trend-container"
      >
        <div class="trend-card">
          <span>{{ trend.title }}</span>
          <div class="indicator" :class="getBackground(currentDay[trend.key])">
            <img
              v-if="currentDay[trend.key]"
              src="../../../assets/icon_thumbsup.svg"
            />
            <img
              v-if="!currentDay[trend.key]"
              src="../../../assets/icon_thumbsdown.svg"
            />
          </div>
        </div>
        <svg
          v-if="
            trend.key !== 'hospitalAvailability' &&
              trend.key !== 'healthcareAvailability'
          "
          :class="`${trend.key}`"
        />
        <div
          v-if="
            trend.key === 'hospitalAvailability' ||
              trend.key === 'healthcareAvailability'
          "
          :class="`${trend.key}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getTrendData } from '../../../../api'
import moment from 'moment'
import { trends } from './trendsHelper'
import { getRiskBackground } from '../../../utils/risk'
export default {
  name: 'Trends',
  props: {
    date: {
      type: String
    }
  },
  data() {
    return {
      trendList: [],
      currentDay: {},
      trends: [...trends]
    }
  },
  computed: {
    dateString() {
      const selectedDate = this.date ? new Date(this.date) : new Date()
      return moment(selectedDate).format('MMMM DD')
    }
  },
  watch: {
    date: async function(newVal) {
      const data = await getTrendData(newVal)
      this.trendList = data.trendList
      this.currentDay = data.currentDay
      d3.select('.score').style(
        'color',
        getRiskBackground(this.currentDay.riskScore)
      )
    },
    trendList: function(newVal) {
      if (newVal) {
        this.renderCharts()
      }
    }
  },
  methods: {
    renderCharts() {
      this.trends.forEach(trend => {
        d3.select(`.${trend.key} > *`).remove()
        if (
          trend.key !== 'hospitalAvailability' &&
          trend.key !== 'healthcareAvailability'
        ) {
          const width = 300
          const height = 50

          const svg = d3
            .select(`.${trend.key}`)
            .attr('viewBox', '0 0 300 50')
            .append('g')

          const data = [...this.trendList]

          // Define and add date axis (X-Axis)
          const x = d3
            .scaleBand()
            .domain(data.map(d => d.date))
            .range([0, width])
          svg
            .append('g')
            .attr('transform', `translate(0,${height - 1})`)
            .call(
              d3
                .axisBottom(x)
                .ticks(0)
                .tickSize(0)
            )

          // Define and add Y axis
          const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d[trend.key]) * 1.75])
            .range([height, 0])
          svg
            .append('g')
            .call(d3.axisLeft(y))
            .select('.domain')
            .remove()

          // Define Line
          const line = d3
            .line()
            .defined(d => !isNaN(d[trend.key]))
            .x(d => x(d.date))
            .y(d => y(d[trend.key]))

          // Plot line
          svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', line)

          // Define the area and append it
          const area = d3
            .area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d[trend.key]))

          svg
            .append('path')
            .data([data])
            .attr('d', area)
            .attr('id', 'area-path')
            .attr('fill', this.currentDay[trend.key] ? 'none' : '#4a4a4a')

          // Close shape on right side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 3)
            .attr('x1', x(data[data.length - 1].date))
            .attr('x2', x(data[data.length - 1].date))
            .attr('y1', y(data[data.length - 1][trend.key]))
            .attr('y2', height)

          // Close shape on left side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 3)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', y(data[0][trend.key]))
            .attr('y2', height)
        } else {
          const container = d3.select(`.${trend.key}`)
          d3.select(`.${trend.key} > *`).remove()
          container.style('display', 'flex').style('width', '100%')

          container
            .append('div')
            .style('display', 'flex')
            .style('justify-content', 'center')
            .style('align-items', 'center')
            .style('height', '35px')
            .style('width', '50%')
            .style('text-transform', 'uppercase')
            .style('font-size', '1.5em')
            .style('font-weight', '600')
            .style(
              'background-color',
              this.currentDay[trend.key] ? '#4a4a4a' : ''
            )
            .style('color', this.currentDay[trend.key] ? 'white' : '#666')
            .text(() => {
              return 'Yes'
            })

          container
            .append('div')
            .style('display', 'flex')
            .style('justify-content', 'center')
            .style('align-items', 'center')
            .style('height', '35px')
            .style('width', '50%')
            .style('text-transform', 'uppercase')
            .style('font-size', '1.5em')
            .style('font-weight', '600')
            .style(
              'background-color',
              !this.currentDay[trend.key] ? '#4a4a4a' : ''
            )
            .style('color', !this.currentDay[trend.key] ? 'white' : '#666')
            .text(() => {
              return 'No'
            })
        }
      })
    },
    getBackground(improving) {
      return improving ? 'greenBg' : 'orangeBg'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 650px;
}

.header {
  display: flex;
  align-items: center;
  .title {
    flex: 3;
    h2 {
      font-weight: 300;
      font-size: 1.5em;
    }
    h3 {
      font-weight: 300;
    }
  }

  .risk-level {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.75em 0.5em;
    max-width: 150px;
    border: 1px solid black;
    .score {
      font-weight: 700;
      font-size: 3em;
    }

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 300;

      .description {
        text-transform: uppercase;
        font-weight: 600;
        color: #666;
        margin-bottom: 5px;
        white-space: nowrap;
      }
    }
  }
}
.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .trend-container {
    display: flex;
    flex-direction: column;
    width: 48%;
    margin-bottom: 1em;
    font-size: 0.9em;

    .trend-card {
      background-color: white;
      box-shadow: 0px 2px 3px 1px #ccc;
      margin-bottom: 1em;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    span {
      padding: 0 1em;
      flex: 5;
    }
  }
}

.indicator {
  flex: 1;
  max-width: 75px;
  align-self: stretch;
  display: flex;
  justify-content: center;
  align-items: center;
}

.greenBg {
  background-color: #49c7b0;
}

.orangeBg {
  background-color: #ff7712;
}
</style>
