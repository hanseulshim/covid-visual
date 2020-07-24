<template>
  <div v-scroll="handleScroll">
    <div id="spacer" />
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <div>Powered by</div>
          <img alt="boost logo" src="../../assets/logo.png" />
        </div>
        <HistoricalChartMini />
      </div>
      <ThreatLevel />
      <Footer />
    </div>
  </div>
</template>

<script>
import HistoricalChartMini from './HistoricalChartMini'
import ThreatLevel from './ThreatLevel'
import Footer from '../Footer'
export default {
  name: 'Detail',
  components: {
    HistoricalChartMini,
    ThreatLevel,
    Footer
  },
  mounted() {
    console.log('sodifjsdf')
    window.moveBy(0, 10)
  },
  methods: {
    handleScroll() {
      if (window.scrollY === 0 && this.$route.name === 'detail') {
        this.$router.push('/')
      }
      return window.scrollY === 0
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  .header {
    height: 150px;
    display: flex;
    padding: 1rem 10rem;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1);
    .logo-container {
      padding-right: 2rem;
      margin-right: 2rem;
      border-right: 1px solid rgba(74, 74, 74, 0.2);
    }
  }
}
#spacer {
  height: 10px;
}
</style>
