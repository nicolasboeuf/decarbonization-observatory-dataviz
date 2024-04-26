<template>
  <div id="globalTemperatureChart" class="chartComponent">
    <h2>Global temperature under current pledges</h2>
    <h3>Visualize global temperature projections under current pledges</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="globalTemperature_chart"></canvas>
      </div>
      <div class="controlsSpace">
        <div class="controlsWrapper">
            
            <div class="controls_box">

              <span class="controls_title">Reference scenario</span>

              <div :class="['controls_tick_container', settings.scenarios['low']?'':'inactive']" @click="switchScenario('low')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Unconditionnal near-term target</span>
              </div>

              <div :class="['controls_tick_container', settings.scenarios['high']?'':'inactive']" @click="switchScenario('high')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Conditionnal near-term target</span>
              </div>

          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { Chart } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';
//import { getData } from '../import.js'

export default {
  name: 'globalTemperatureChart',
  data(){
    return {
      chart: undefined,
      labels:[],
      datasets:[],
      datasetsLabel:[],
      settings:{
        "scenarios":{"low":true,"high":true}
      },
      colors:["rgba(0,76,109,1)","rgba(0,103,138,1)"],
      bgColors:["rgba(0,76,109,0)","rgba(0,103,138,0)"],
    }
  },
  props: {
  },
  computed: {
    globalTempDataEndImport() {
      return store.state.globalTempDataEndImport
    },
    globalTempData(){
      return store.state.globalTempData
    }
  },

  methods: {

    updateData(){
      
      this.labels.length = 0
      this.datasets.length = 0
      this.datasetsLabel.length = 0

      var self = this

      const byCond = Object.groupBy(self.globalTempData, ({ Conditionality }) => Conditionality);

      Object.keys(byCond).forEach(function(Conditionality){
        var dataset =
          {
            data: [],
            type: 'line',
            backgroundColor: self.bgColors[self.datasets.length],
            borderColor: self.colors[self.datasets.length],
            pointRadius: 15,
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointHoverRadius: 15
          }
        byCond[Conditionality].forEach(function(d){
          var temp_float = parseFloat(d["dT"].replace(",","."))
          if(!self.labels.includes(d["Year"])){ self.labels.push(d["Year"]) }
          dataset["data"].push(temp_float)
        })
        if(self.settings.scenarios[Conditionality.toLowerCase()]==true){
          self.datasets.push(dataset)  
          if(Conditionality == "Low"){
            self.datasetsLabel.push("Unconditionnal")
          }else{
            self.datasetsLabel.push("Conditionnal")
          }
        }
        
      })
      
    },

    createChart(){
      var self = this

      this.updateData()
      console.log(annotationPlugin)
      const ctx = document.getElementById("globalTemperature_chart").getContext('2d')
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
                maxTicksLimit: 100,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value % 10 === 0 ? value:''
                }
              }
            }],
            yAxes: [{
              gridLines: {
                color: '#e5e5e5',
                borderDash: [0]
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 15,
                beginAtZero: false,
                callback: function (value) {
                  return value.toLocaleString()
                }
              },
            }]
          },
          legend: {
            display: false
          },
           annotation: {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 2,
                borderColor: 'rgb(249, 174, 21)',
                borderWidth: 1,
                label: {
                  enabled: true,
                  content: '+ 2°C',
                  position:"right",
                  backgroundColor: 'rgba(999,999,999,1)',
                  fontColor:'rgb(249, 174, 21)'
                }
              },
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 1.3,
                borderColor: 'rgb(249, 174, 21)',
                borderWidth: 1,
                label: {
                  enabled: true,
                  content: '+ 1,3°C',
                  position:"right",
                  backgroundColor: 'rgba(999,999,999,1)',
                  fontColor:'rgb(249, 174, 21)'
                }
              }
            ]
          },
          tooltips:{
            callbacks:{
              title: function (tooltipItem) {
                return(tooltipItem[0]["xLabel"])
              },
              label: function(tooltipItem){
                var value = "+"+parseFloat(tooltipItem["value"]).toLocaleString()+" °C"
                return(value)
              },
              labelColor: function(tooltipItem) {
                return {
                  borderColor: self.colors[tooltipItem["datasetIndex"]],
                  backgroundColor: self.colors[tooltipItem["datasetIndex"]],
                }
              },
              afterTitle:function(tooltipItem){
                return(self.datasetsLabel[tooltipItem[0]["datasetIndex"]])
              }
            }
          }
        }
      })
    },
    updateChart(){
      this.updateData()
      this.chart.update()
    },

    switchScenario(scenario){
      if(this.settings.scenarios[scenario] == true){
        this.settings.scenarios[scenario] = false
      }else{
        this.settings.scenarios[scenario] = true
      }
    },
    
    
  },

  watch:{
    globalTempDataEndImport:function(){
      if(this.chart){
        this.updateChart()
      }else{
        this.createChart()
      }
    },
    settings: {
       handler(){
          this.updateChart()
       },
       deep: true
    }
  },

  created(){
    console.log("globalTemperatureChart created")
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
