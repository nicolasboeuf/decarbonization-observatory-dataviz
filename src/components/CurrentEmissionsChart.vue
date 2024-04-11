<template>
  <div id="currentEmissionsChart" class="chartComponent">
    <h2>Emissions under current pledges</h2>
    <h3>Visualize global and country-level emissions projections under current pledges</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="chart"></canvas>
      </div>
      <div class="controlsSpace"></div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { Chart } from 'chart.js'

export default {
  name: 'CurrentEmissionsChart',
  data(){
    return {
      datasets:[
        {
          data: [1,2,3,1],
          type: 'line',
          backgroundColor: "#FF5733",
          borderColor: "#FF5733",
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverRadius: 6
        },
        {
          data: [2,3,1,2],
          type: 'line',
          backgroundColor: "#33FF62",
          borderColor: "#33FF62",
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverRadius: 6
        },
      ],
      labels:["test1","test2","test3","test4"]
    }
  },
  props: {
  },
  computed: {
    dataImport() {
      return store.state.endImport
    },
    myData(){
      return store.state.myData
    }
  },
  methods: {
    filterData(){
      console.log(this.myData)
      this.createChart()
    },
    createChart(){
      var self = this
      const ctx = document.getElementById("chart").getContext('2d')
      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: self.datasets
        },
        options: {
          animation: {
            easing: 'easeInOutBack'
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 3,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value
                }
              }
            }],
            yAxes: [{
              gridLines: {
                color: '#e5e5e5',
                borderDash: [3]
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
              },
            }]
          },
          legend: {
            display: false
          },
        }
      })
    }
  },

  watch:{
    dataImport:function(){
      this.filterData()
    }
  },

  created(){
    console.log("CurrentEmissionsChart created")
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";

  canvas{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  

  @media (max-width: 728px) {
    
  }


</style>
