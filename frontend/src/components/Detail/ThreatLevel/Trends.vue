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
          <span>{{ new Date().toLocaleDateString('en-US') }}</span>
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
            .attr('width', width)
            .attr('height', height)
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
            .curve(d3.curveMonotoneX)
            .x(d => x(d.date))
            .y(d => y(d.value))

          // Plot line
          svg
            .append('path')
            .datum(arr)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', line)

          // Close shape on right side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('x1', width - 1)
            .attr('x2', width - 1)
            .attr('y1', y(arr[arr.length - 1].value))
            .attr('y2', height)

          // Close shape on left side
          svg
            .append('line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  .title {
    flex: 3;
    white-space: nowrap;
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
    height: 75%;
    max-height: 70px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0em 0.25em;

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

    .trend-card {
      background-color: white;
      box-shadow: 0px 2px 3px 1px #ccc;
      margin-bottom: 1em;
      min-height: 60px;
      padding: 0.5em;
      display: flex;
      align-items: center;
    }
  }
}

.white-font {
  color: white;
}

.grey-font {
  color: #ededed;
}
</style>
