<template>
  <div class="main">
    <Trends />
    <Map />
  </div>
</template>

<script>
import Trends from './Trends'
import Map from './Map'
export default {
  name: 'ThreatLevel',
  components: {
    Trends,
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
