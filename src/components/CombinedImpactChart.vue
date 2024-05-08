<template>
  <div id="combinedImpactChart" class="chartComponent">
    <h2>Combined impact of enhanced or delayed pledges</h2>
    <h3>Visualize the impact of combined impact of enhanced or delayed pledges comparing to base</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="combinedImpact_chart"></canvas>
      </div>
      <div class="controlsSpace">
        <div class="controlsWrapper">

        <div class="controls_box">
          <span class="controls_title">See the impact on</span>

          <div class="toggle_controls_wrapper" @click="toggleVariable()">
            <span :class="['toggle_controls_label',settings.value=='emissions'?'active':'']">Emissions</span>
            <div :class="['toggle_controls_box',settings.value=='emissions'?'':'toggled']">
              <div class="toggle_controls_inner"></div>
            </div>
            <span :class="['toggle_controls_label',settings.value=='temperature'?'active':'']">Temperature</span>
          </div>

        </div>

        <div class="controls_box">
          <span class="controls_title">Country</span>

          <div class="controls_dropdown">
            <input type="text" class="dropdown-input" v-model="searchString" @input="filterOptions" placeholder="Type to search" @focus="focusInput()">
            <div class="dropdown-menu" v-show="showDropdown">
              <div class="dropdown-menu-item" v-for="option,index in filtredCountry" :key="index" @click="selectOption(option)">
                {{option}}
              </div>
            </div>
          </div>
        </div>

        <div class="controls_box">

          <span class="controls_title">Reference scenario</span>

          <div :class="['controls_radio_container',settings.scenario=='High'?'inactive':'']" @click="settings.scenario='Low'">
            <div class="radio">
              <div class="radio_inner"></div>
            </div>
            <span class="radio_label">Unconditionnal near-term target</span>
          </div>

          <div :class="['controls_radio_container',settings.scenario=='Low'?'inactive':'']" @click="settings.scenario='High'">
            <div class="radio">
              <div class="radio_inner"></div>
            </div>
            <span class="radio_label">Conditionnal near-term target</span>
          </div>

        </div>

        <div class="controls_box">
          
          <span class="controls_title">Select one or more pledge(s)</span>

          <div class="controls_multiple_tick_container sequential">

            <div class="controls_tick_container non-selectable">
              <div class="tick">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">Reference</span>
            </div>
              
            <div v-for="s,i in settings.pledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)"> 
              <div class="tick" :style="settings.selectedPledges.includes(s)?{backgroundColor: colors[i+2]}:{backgroundColor:'#fff'}">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">{{s}}</span>
            </div>

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
import { getCombinedImpactData } from '../import.js'

export default {
  name: 'CombinedImpactChart',
  data(){
    return {
      chart: undefined,
      datasets:[],
      preservedDatasets:[],
      datasetsLabel:[],
      labels:[],
      countriesList:["World"],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "value":"emissions",
        "variable":"CO2eq_Total",
        "scenario":"Low",
        "pledges":["NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01","LUF02","LUF03"],
        "selectedPledges":["Low","High","NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01","LUF02","LUF03"]
      },
      colors:["rgba(146, 221, 248, 1)","rgba(246, 91, 68, 1)","rgba(126, 188, 174, 1)","rgba(0, 105, 128, 1)","rgba(162, 191, 206, 1)","rgba(255, 198, 119, 1)","rgba(71, 143, 129, 1)","rgba(255, 159, 0, 1)","rgba(146, 221, 248, 1)","rgba(246, 91, 68, 1)","rgba(126, 188, 174, 1)","rgba(0, 105, 128, 1)","rgba(162, 191, 206, 1)","rgba(255, 198, 119, 1)","rgba(71, 143, 129, 1)","rgba(255, 159, 0, 1)","rgba(146, 221, 248, 1)","rgba(246, 91, 68, 1)","rgba(126, 188, 174, 1)","rgba(0, 105, 128, 1)","rgba(162, 191, 206, 1)","rgba(255, 198, 119, 1)","rgba(71, 143, 129, 1)","rgba(255, 159, 0, 1)"],
    }
  },
  props: {
  },
  computed: {
    combinedImpactDataEndImport() {
      return store.state.combinedImpactDataEndImport
    },
    combinedImpactData(){
      return store.state.combinedImpactData
    }
  },
  methods: {

    updateData(){
      
      this.labels.length = 0
      this.datasets.length = 0
      this.datasetsLabel.length = 0
      this.preservedDatasets.length = 0

      var self = this

      if(self.combinedImpactData[this.settings["data"]]){

        const byVariable = Object.groupBy(self.combinedImpactData[self.settings["data"]], ({ Variable }) => Variable);

        
        byVariable[self.settings.variable].forEach(function(pledge){

          if(!self.labels.includes(pledge["Year"])){ self.labels.push(pledge["Year"]) }

        })

        self.settings.selectedPledges.forEach(function(p,j){

            const ctx = document.getElementById("impactScenarios_chart").getContext('2d')

            var gradientFill

            gradientFill = ctx.createLinearGradient(0, 0, 0, 442)
            gradientFill.addColorStop(0, self.colors[self.datasets.length])
            gradientFill.addColorStop(1, 'rgba(245, 245, 255, 0)')

            var bD = [0]
            if(p === "Low" || p === "High"){
              bD = [5]
            }

            var dataset =
              {
                data: [],
                type: 'line',
                fill:true,
                borderDash: bD,
                backgroundColor:  'rgba(0, 0, 0, 0)',
                borderColor: self.colors[self.datasets.length],
                pointRadius: 15,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverRadius: 15,
                order:j
              }

            var preservedDataset = { data : [] }

            byVariable[self.settings.variable].forEach(function(pledge,i){

              var d = parseFloat(pledge[p].replace(",","."))
              preservedDataset["data"].push(d)
              if(j!=0){d = d + self.datasets[j-1]["data"][i]}
              dataset["data"].push(d)

            })

            self.datasets.push(dataset)
            self.datasetsLabel.push(p)
            self.preservedDatasets.push(preservedDataset)
            
        })       

        if(this.settings.scenario == "High"){
          self.datasets.shift()
          self.datasetsLabel.shift()
        }


      }else{
        getCombinedImpactData(store,this.settings["data"])
      }

    },

    createChart(){
      var self = this

      this.updateData()

      const ctx = document.getElementById("combinedImpact_chart").getContext('2d')
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
              scaleLabel:{
                display:true,
                labelString:"Year",
              },
              ticks: {
                autoSkip: false,
                maxTicksLimit: 100,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value % 10 === 0 ? value:''
                }
              }
            }],
            yAxes: [{
              stacked: false,
              gridLines: {
                color: '#e5e5e5',
                borderDash: [0]
              },
              scaleLabel:{
                display:true,
                labelString:"tons CO2eq",
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 15,
                beginAtZero: true,
                callback: function (value) {
                  return value.toLocaleString()
                }
              },
            }]
          },
          legend: {
            display: false
          },
          tooltips:{
            callbacks:{
              title: function (tooltipItem) {
                return(tooltipItem[0]["xLabel"])
              },
              label: function(tooltipItem){
                var value
                if(self.settings.value == "emissions"){
                  value = parseInt(self.preservedDatasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString()+" tonnes CO2eq"
                }else{
                  value = parseFloat(self.preservedDatasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString()+" °C"
                }
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

    toggleVariable(){
      if(this.settings.value == "emissions"){
        this.settings.value = "temperature"
        this.settings.variable = "dT"
      }else{
        this.settings.value = "emissions"
        this.settings.variable = "CO2eq_Total"
      }
    },

    filterOptions() {
      this.filtredCountry = this.countriesList.filter(option => {
        return option.toLowerCase().includes(this.searchString.toLowerCase());
      });
      this.showDropdown = true;
    },
    selectOption(option) {
      this.settings.data = option.toLowerCase();
      this.searchString = option
      this.showDropdown = false;
    },
    focusInput(){
      this.searchString=""
      this.showDropdown=true
      this.filtredCountry = this.countriesList
    },

    togglePledge(s){

      var index = this.settings.pledges.indexOf(s)
      var l = this.settings.pledges.length

      if(this.settings.selectedPledges.includes(s)){
        for(var i = l;i>=index;i--){
          this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== this.settings.pledges[i]);
        }
      }else{
        for(var j = 0;j<=index;j++){
          if(!this.settings.selectedPledges.includes(this.settings.pledges[j])){
            this.settings.selectedPledges.push(this.settings.pledges[j]);
          }
        }
      }
    },

    updateChart () {
      this.updateData()
      this.chart.update()
      if(this.settings.variable == "CO2eq_Total"){
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "tons CO2eq"
      }else{
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "°C"
      }
    }

    
  },

  watch:{
    combinedImpactDataEndImport:function(){
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
