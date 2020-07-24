<template>
  <div class="map-container">
    <svg class="map" />
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'Map',
  data() {
    return {
      stateData: [
        { name: 'Maryland', population: 123 },
        { name: 'Virginia', population: 456 }
      ]
    }
  },
  async mounted() {
    // const data = await getStateData()
    this.renderChart()
  },
  methods: {
    renderChart() {
      // Le Chart
      const width = 750
      const height = 500

      // Size our SVG
      const svg = d3
        .select('.map')
        .attr('width', width)
        .attr('height', height)

      const tooltip = d3
        .select('.map-container')
        .append('div')
        .attr('class', 'hidden tooltip')

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
        'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
      )
        .then(data => {
          // How we add state level data properties to our geoJson
          data.features.forEach(stateJson => {
            this.stateData.forEach(state => {
              const jsonStateName = stateJson.properties.name
              const stateDataName = state.name

              if (jsonStateName === stateDataName) {
                stateJson.properties.population = state.population
              }
            })
          })

          console.log(data)

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
                .html([d.properties.name, d.properties.population])
            })
            .on('mouseout', function() {
              tooltip.classed('hidden', true)
            })

          g.append('path')
            .datum(data)
            .attr('id', 'state-borders')
            .attr('d', path)

          // Mock safety level data. Randomly assign state colors
          g.selectAll('path').attr('fill', () => {
            const safetyLevel = parseInt((Math.random() * 6).toFixed(1))

            return safetyLevel <= 0.5
              ? '#49c7b0'
              : safetyLevel > 0.5 && safetyLevel <= 1.5
              ? '#68ba96'
              : safetyLevel > 1.5 && safetyLevel <= 2.5
              ? '#86ad7c'
              : safetyLevel > 2.5 && safetyLevel <= 3.5
              ? '#a59f61'
              : safetyLevel > 3.5 && safetyLevel <= 4.5
              ? '#c39247'
              : safetyLevel > 4.5 && safetyLevel <= 5.5
              ? '#E1852D'
              : safetyLevel > 5.5 && safetyLevel <= 6
              ? '#FF7813'
              : null
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
div.tooltip {
  color: #222;
  background-color: #fff;
  padding: 0.5em;
  text-shadow: #f5f5f5 0 1px 0;
  border-radius: 2px;
  opacity: 0.9;
  position: absolute;
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
