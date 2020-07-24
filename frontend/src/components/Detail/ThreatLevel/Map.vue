<template>
  <div class="container">
    <svg class="map" />
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'Map',
  data() {
    return {}
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      // Le Chart
      const width = 800
      const height = 500
      let centered

      // Size our SVG
      const svg = d3
        .select('.map')
        .attr('width', width)
        .attr('height', height)

      // Add background and add click handler to zoom out
      svg
        .append('rect')
        .attr('class', 'map-background')
        .attr('width', width)
        .attr('height', height)
        .on('click', clicked)

      // Append group element
      const g = svg.append('g')

      // U.S.A. !!!
      const projection = d3
        .geoAlbersUsa()
        .scale(1070)
        .translate([width / 2, height / 2])

      // Path generator for our USA projection. Make GeoJSON coords into paths in SVG
      const path = d3.geoPath().projection(projection)

      // Click handler. Zoom on a state if one is selected, if not zoom out
      const clicked = d => {
        let x, y, k

        if (d && centered !== d) {
          var centroid = path.centroid(d)
          x = centroid[0]
          y = centroid[1]
          k = 4
          centered = d
        } else {
          x = width / 2
          y = height / 2
          k = 1
          centered = null
        }

        g.selectAll('path').classed(
          'active',
          centered &&
            function(d) {
              return d === centered
            }
        )

        g.transition()
          .duration(750)
          .attr(
            'transform',
            'translate(' +
              width / 2 +
              ',' +
              height / 2 +
              ')scale(' +
              k +
              ')translate(' +
              -x +
              ',' +
              -y +
              ')'
          )
          .style('stroke-width', 1.5 / k + 'px')
      }

      // Get the GeoJSON from this random source, map the GeoJSON to svg paths
      d3.json(
        'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
      )
        .then(data => {
          g.append('g')
            .attr('id', 'states')
            .selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .on('click', clicked)

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
.container {
  flex: 1;
}
</style>
<style lang="scss">
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
