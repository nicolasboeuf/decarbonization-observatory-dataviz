<template>
  <div id="app">
    <h1>Observatory of the global and national decarbonization</h1>
    <CurrentEmissionsChart></CurrentEmissionsChart>
  </div>
</template>

<script>

import CurrentEmissionsChart from './components/CurrentEmissionsChart.vue'
import store from '@/store'
import { getData } from './import.js'

export default {
  name: 'App',
  components: {
    CurrentEmissionsChart
  },

  computed: {
    dataImport() {
      return store.state.endImport
    },
    myData(){
      return store.state.myData
    }
  },

  watch:{
    dataImport:function(){
      
    }
  },
  
  created(){
    getData(store)
  }
}
</script>

<style lang="scss">

@import "../css/variables.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  h1{
    color:blue;
    font-family: "barlow-bold";
    font-size:21px;
    background:$semiGradientDark;
    display: inline-block;
    padding: 5px 25px 5px 25px;
    box-sizing: border-box;
    color:white;
    border-radius: 15px;
  }
  h2{
    color:$mediumBlue;
    font-family: "barlow-bold";
    font-size:17px;
  }
  h3{
    font-family: "DMSans-Regular";
    font-size:11px;
  }
  .chartComponent{
    width: 100%;
    height:500px;
    position: relative;
    .componentSpace{
      position: relative;
      .chartSpace{
        position: relative;
        width: 70%;
        height: 500px;
        display: inline-block;
        }
      .controlsSpace{
        position: relative;
        width: 30%;
        height: 500px;
        display: inline-block;
        background-color: green;
      }
    }
  }

  @media (max-width: 728px) {

    .chartComponent{
      .componentSpace{
        .chartSpace{
          width: 100%;
          display: block;
          
          }
        .controlsSpace{
          width: 100%;
          display: block;
        }
      }
    }
    
  }
}
</style>
