<template>
  <div v-scroll="handleScroll">
    <div class="container">
      <div>Powered by</div>
      <img alt="boost logo" src="../../assets/logo.png" />
      <div class="title">Are States Ready to Reopen?</div>
      <div class="description">
        In the early months of the 2020 Covid-19 pandemic, the Centers for
        Disease Control & Prevention (CDC) outlined criteria for states to
        consider before reopening. These 6 criteria determine the threat level
        within a state. The CDC recommended that states should only reopen if
        all 6 criteria were met. Click here to read more about these criteria.
      </div>
      <div class="risk">RISK LEVEL</div>
      <div class="bar" />
      <div class="label-container">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
      </div>
      <HistoricalChart />
    </div>
    <div id="spacer" />
  </div>
</template>

<script>
import HistoricalChart from './HistoricalChart'

export default {
  name: 'Landing',
  components: {
    HistoricalChart
  },
  methods: {
    handleScroll() {
      if (window.scrollY > 0 && this.$route.name === 'landing') {
        this.$router.push('detail')
      }
      return window.scrollY > 0
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 3rem 10rem 0 10rem;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  img {
    width: 140px;
  }
  .title {
    font-size: 3rem;
    text-align: center;
    font-style: normal;
    line-height: 2rem;
    margin-bottom: 2rem;
  }
  .description {
    text-align: center;
    width: 40rem;
    line-height: 2rem;
    align-self: center;
  }
  .risk {
    text-align: center;
    font-weight: bold;
    margin-top: 2rem;
  }
  .bar {
    margin: 0.5rem auto;
    width: 38rem;
    height: 1rem;
    background: linear-gradient(90deg, #49c7b0 0.57%, #ff7813 99.33%);
  }
  .label-container {
    width: 38rem;
    align-self: center;
    display: flex;
    justify-content: space-between;
  }
}
#spacer {
  height: 1px;
}
</style>
