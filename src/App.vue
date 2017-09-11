<template>
  <div id="app">
    <tab-controle-gasto></tab-controle-gasto>
  </div>
</template>

<script>
import TabControleGasto from './components/TabControleGasto';
export default {

  name: 'app',
  components: {
    'tab-controle-gasto': TabControleGasto,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
