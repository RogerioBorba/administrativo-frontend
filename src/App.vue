<template>
  <div id="app">
    
    <tipo-gasto></tipo-gasto>
  </div>
</template>

<script>
import TipoGasto from './components/TipoGasto'

export default {
  name: 'app',
  components: {
    'tipo-gasto': TipoGasto
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
  margin-top: 60px;
}
</style>
