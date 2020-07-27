<template>
  <div class="map-container">
    <svg class="map" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getTrendData } from '../../../../api'
import { getRiskBackground } from '../../../utils/risk'
export default {
  name: 'Map',
  props: {
    date: {
      type: String
    }
  },
  data() {
    return {
      stateData: []
    }
  },
  watch: {
    date: async function(newVal) {
      const data = await getTrendData(newVal)
      this.stateData = data.stateList
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      // Le Chart
      const width = 750
      const height = 550

      // Size our SVG
      const svg = d3
        .select('.map')
        .attr('width', width)
        .attr('height', height)

      const tooltip = d3
        .select('.map-container')
        .append('div')
        .attr('class', 'hidden map-tooltip')

      // Append group element
      const g = svg.append('g')

      // U.S.A. !!!
      const projection = d3
        .geoAlbersUsa()
        .scale(850)
        .translate([width / 2, height / 2])

      // Path generator for our USA projection. Make GeoJSON coords into paths in SVG
      const path = d3.geoPath().projection(projection)

      // Get the GeoJSON from this random source, map the GeoJSON to svg paths
      d3.json(
        'https://raw.githubusercontent.com/shawnbot/topogram/master/data/us-states.geojson'
      )
        .then(data => {
          // How we add state level data properties to our geoJson
          data.features.forEach(stateJson => {
            this.stateData.forEach(state => {
              const jsonStateName = stateJson.properties.postal
              const stateDataName = state.state

              if (jsonStateName === stateDataName) {
                stateJson.properties.positiveCases = state.positiveCases
                stateJson.properties.riskScore = state.riskScore
              }
            })
          })

          g.append('g')
            .attr('id', 'states')
            .selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .on('mousemove', function(d) {
              var mouse = d3.mouse(svg.node()).map(function(d) {
                return parseInt(d)
              })

              tooltip
                .classed('hidden', false)
                .attr(
                  'style',
                  'left:' +
                    (mouse[0] + 15) +
                    'px; top:' +
                    (mouse[1] - 35) +
                    'px'
                )
                .style('background', getRiskBackground(d.properties.riskScore))

                .html(
                  `<p class='state-name'>${d.properties.name}</p>
                  <p>Cases: ${d.properties.positiveCases.toLocaleString()}</p>
                  <p>Risk Level: ${d.properties.riskScore}</p>`
                )
            })
            .on('mouseout', function() {
              tooltip.classed('hidden', true)
            })

          g.append('path')
            .datum(data)
            .attr('id', 'state-borders')
            .attr('d', path)

          g.selectAll('path').attr('fill', d => {
            if (d.properties) {
              const score = d.properties.riskScore
              return getRiskBackground(score)
            }
          })
        })
        .catch(error => console.error(error))
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  flex: 1;
  position: relative;
}
</style>
<style lang="scss">
.hidden {
  display: none;
}
div.map-tooltip {
  text-shadow: #f5f5f5 0 1px 0;
  opacity: 0.9;
  position: absolute;
  font-size: 0.75rem;
  padding: 5px 10px;
  color: #fff;
  border-radius: 2px;
  box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.3);
  p {
    margin: 0;
    margin-bottom: 5px;
  }

  .state-name {
    font-size: 1rem;
  }
}
.map-background {
  fill: none;
  pointer-events: all;
}

#states .active {
  stroke: #fff;
  stroke-width: 3px;
  transition: 1s;
}

#state-borders {
  fill: none;
  stroke: #ededed;
  stroke-width: 1px;
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}
</style>
