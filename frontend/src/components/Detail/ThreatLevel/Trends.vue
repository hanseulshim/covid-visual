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
        class="threat-container"
      >
        <div class="threat-card">
          <span>{{ threat.threatTitle }}</span>
        </div>
        <div class="threat-chart">
          {{ renderChart(threat) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { threats } from './threats'
export default {
  name: 'Trends',
  data() {
    return {
      threats: [...threats]
    }
  },
  mounted() {},
  methods: {
    renderChart(threat) {
      console.log(threat)
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

  .threat-container {
    display: flex;
    flex-direction: column;
    max-width: 48%;
    margin-bottom: 1em;

    .threat-card {
      background-color: white;
      box-shadow: 0px 2px 3px 1px #ccc;
      padding: 1em;
    }
  }
}
</style>
