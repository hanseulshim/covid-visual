<template>
  <div class="main">
    <RiskTrends />
    <Map />
  </div>
</template>

<script>
import RiskTrends from './RiskTrends'
import Map from './Map'
export default {
  name: 'ThreatLevel',
  components: {
    RiskTrends,
    Map
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 2rem 0 2rem 10rem;
  display: flex;
}
</style>
