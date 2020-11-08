<template>
  <div id="app">
    <Table/>
    <Chart v-if="getLoading" />
  </div>
</template>

<script>
import Table from './components/Table.vue'
import Chart from './components/Сhart.vue'

export default {
  name: 'App',
  components: {
    Table,
    Chart
  },
  computed : {
    getLoading(){
      return !this.$store.getters.getLoading
    },

  },
   async created() {
     await this.$store.dispatch("loadExchanges")
     await this.$store.dispatch('loadSomeInfo')
   }
}
</script>

<style lang="scss" scoped>
  #app{
    display: flex;
    margin-top: 50px;
    justify-content: space-around;
  }
</style>

