<template>
  <div id="impactScenariosChart" class="chartComponent">
    <h2>Impact of enhanced or delayed pledges</h2>
    <h3>Visualize the impact of enhanced or delayed scenarios comparing to base</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="impactScenarios_chart"></canvas>
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

          <div class="controls_multiple_tick_container">
              
            <div v-for="s in settings.pledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)">
              <div class="tick">
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
import { getImpactScenariosData } from '../import.js'

export default {
  name: 'ImpactScenariosChart',
  data(){
    return {
      chart: undefined,
      datasets:[],
      datasetsLabel:[],
      labels:[],
      countriesList:["World","China"],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "value":"emissions",
        "variable":"CO2eq_Total",
        "scenario":"Low",
        "pledges":["NDC01","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","CH4++","N2O++"],
        "selectedPledges":["NDC01","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","CH4++","N2O++"],
      },
      colors:["rgba(146, 221, 248, 1)","rgba(246, 91, 68, 1)","rgba(126, 188, 174, 1)","rgba(0, 105, 128, 1)","rgba(162, 191, 206, 1)","rgba(255, 198, 119, 1)","rgba(71, 143, 129, 1)","rgba(255, 159, 0, 1)","rgba(255, 159, 0, 1)"],
    }
  },
  props: {
  },
  computed: {
    impactScenariosDataEndImport() {
      return store.state.impactScenariosDataEndImport
    },
    impactScenariosData(){
      return store.state.impactScenariosData
    }
  },
  methods: {

    updateData(){
      
      this.labels.length = 0
      this.datasets.length = 0
      this.datasetsLabel.length = 0

      var self = this

      if(self.impactScenariosData[this.settings["data"]]){

        const byVariable = Object.groupBy(self.impactScenariosData[self.settings["data"]], ({ Variable }) => Variable);
        
        Object.keys(byVariable).forEach(function(Variable){

            const byScenario = Object.groupBy(byVariable[Variable], ({ Scenario }) => Scenario);
            byVariable[Variable] = byScenario

          })

        Object.keys(byVariable[self.settings.variable]).forEach(function(pledge){

          if(self.settings.selectedPledges.includes(pledge)){

            const ctx = document.getElementById("impactScenarios_chart").getContext('2d')

            var gradientFill

            gradientFill = ctx.createLinearGradient(0, 0, 0, 442)
            gradientFill.addColorStop(0, self.colors[self.datasets.length])
            gradientFill.addColorStop(1, 'rgba(245, 245, 255, 0)')

            var dataset =
              {
                data: [],
                type: 'line',
                backgroundColor:gradientFill,
                borderColor: self.colors[self.datasets.length],
                pointRadius: 15,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverRadius: 15
              }

            byVariable[self.settings.variable][pledge].forEach(function(item){
              if(!self.labels.includes(item["Year"])){ self.labels.push(item["Year"]) }
              if(self.settings.variable == "dT"){
                dataset["data"].push(parseFloat(item["Value"].replace(",",".")))  
              }else{
                dataset["data"].push(parseFloat(item["Value"]))  
              }
            })

            self.datasets.push(dataset)
            self.datasetsLabel.push(pledge)          

          }
          
        })

      }else{
        getImpactScenariosData(store,this.settings["data"])
      }

    },

    createChart(){
      var self = this

      this.updateData()

      const ctx = document.getElementById("impactScenarios_chart").getContext('2d')
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
              gridLines: {
                color: '#e5e5e5',
                borderDash: [0]
              },
              ticks: {
                autoSkip: false,
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
                var value = parseInt(tooltipItem["value"]).toLocaleString()+" tonnes CO2eq"
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
      
      if(this.settings.selectedPledges.includes(s)){
        if(this.settings.selectedPledges.length > 1){
          this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== s);
        }
      }else{
        this.settings.selectedPledges.push(s)
      }
    },

    updateChart () {
      this.updateData()
      this.chart.update()
    }

    
  },

  watch:{
    impactScenariosDataEndImport:function(){
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
