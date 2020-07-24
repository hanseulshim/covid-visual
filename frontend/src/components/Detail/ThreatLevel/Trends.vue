<template>
  <div class="container">
    <div class="header">
      <div class="title">
        <h2>The 6 levels of threat across the U.S.</h2>
        <h3>Over the past 14 days</h3>
      </div>
      <div class="risk-level">
        <span class="score">3</span>
        <div>
          <span class="description">Risk Level</span>
          <span>{{ dateString }}</span>
        </div>
      </div>
    </div>
    <div class="charts-container">
      <div
        v-for="(threat, index) in threats"
        v-bind:key="index"
        class="trend-container"
      >
        <div class="trend-card">
          <span>{{ threat.threatTitle }}</span>
          <div class="indicator" :class="getBackground(threat.improving)">
            <img
              v-if="threat.improving"
              src="../../../assets/icon_thumbsup.svg"
            />
            <img
              v-if="!threat.improving"
              src="../../../assets/icon_thumbsdown.svg"
            />
          </div>
        </div>
        <div :class="`trend-chart-${index}`" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { threats } from './threats'
export default {
  name: 'Trends',
  data() {
    return {
      threats: [...threats]
    }
  },
  mounted() {
    this.renderCharts()
  },
  computed: {
    dateString: () => {
      const date = new Date()
      const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(
        date
      )
      const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
      return `${month} ${day}`
    }
  },
  methods: {
    renderCharts() {
      this.threats.forEach((threat, index) => {
        if (threat.data.length) {
          const width = 300
          const height = 50
          // Append the SVG object to the body of the page
          const svg = d3
            .select(`.trend-chart-${index}`)
            .append('svg')
            .attr('viewBox', '0 0 300 50')
            .append('g')

          const arr = threat.data.map(day => {
            return {
              ...day,
              date: new Date(day.date)
            }
          })

          // Define and add date axis (X-Axis)
          const x = d3
            .scaleUtc()
            .domain(d3.extent(arr, d => d.date))
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
            .domain([0, d3.max(arr, d => d.value) * 1.1])
            .range([height, 0])
          svg
            .append('g')
            .call(d3.axisLeft(y))
            .select('.domain')
            .remove()

          // Define Line
          const line = d3
            .line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))

          // Plot line
          svg
            .append('path')
            .datum(arr)
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', line)

          // Define the area and append it
          const area = d3
            .area()
            .x(function(d) {
              return x(d.date)
            })
            .y0(height)
            .y1(function(d) {
              return y(d.value)
            })

          svg
            .append('path')
            .data([arr])
            .attr('fill', !threat.improving ? '#4a4a4a' : 'none')
            .attr('d', area)

          // Close shape on right side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 3)
            .attr('x1', width - 1)
            .attr('x2', width - 1)
            .attr('y1', y(arr[arr.length - 1].value))
            .attr('y2', height)

          // Close shape on left side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 3)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', y(arr[0].value))
            .attr('y2', height)
        } else {
          const container = d3.select(`.trend-chart-${index}`)
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
            .style('background-color', () => {
              threat.isTrue ? '#4a4a4a' : ''
            })
            .style('color', threat.isTrue ? 'white' : '#666')
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
            .style('background-color', !threat.isTrue ? '#4a4a4a' : '')
            .style('color', !threat.isTrue ? 'white' : '#666')
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
    border: 2px solid #a59f61;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.75em 0.5em;
    max-width: 150px;
    .score {
      color: #a59f61;
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
