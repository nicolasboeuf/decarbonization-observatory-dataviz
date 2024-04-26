<template>
  <div id="currentEmissionsChart" class="chartComponent">
    <h2>Emissions under current pledges</h2>
    <h3>Visualize global and country-level emissions projections under current pledges</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="chart"></canvas>
      </div>
      <div class="controlsSpace">
        <div class="controlsWrapper">

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

            <span class="controls_title">Historical</span>

            <div class="switch_controls_box" @click="switchHistorical()">
              <div class="switch_container">
                <div :class="['switch switch_on',settings.historical?'':'inactive']">
                  <svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                </div>
                <div :class="['switch switch_on',settings.historical?'inactive':'']">
                  <svg viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
              </div>
              <span class="switch_label">Historical emissions</span>
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

            <span class="controls_title">Greenhouse gase</span>

            <div :class="['controls_tick_container', settings.greenhouse['LULUCF']?'':'inactive', settings.data!='world'?'disable inactive':'']" @click="switchGreenhouse('LULUCF')">
              <div class="tick">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">CO2eq</span>
            </div>

            <div :class="['controls_tick_container', settings.greenhouse['Non-LULUCF']?'':'inactive']" @click="switchGreenhouse('Non-LULUCF')">
              <div class="tick">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">CO2eq excl. LULUCF</span>
            </div>

            <div :class="['controls_tick_container', settings.greenhouse['Total']?'':'inactive']" @click="switchGreenhouse('Total')">
              <div class="tick">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">Total</span>
            </div>

          </div>

          <div class="controls_box boxed">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Individual gases contribution</span>
            </div>

            <div class="controls_box_body">

              <div :class="['controls_tick_container', settings.individual['CO2eq']?'':'inactive']" @click="switchIndividual('CO2eq')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">CO2eq</span>
              </div>

              <div :class="['controls_tick_container', settings.individual['CH4']?'':'inactive']" @click="switchIndividual('CH4')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">CH4</span>
              </div>

              <div :class="['controls_tick_container', settings.individual['CO2']?'':'inactive']" @click="switchIndividual('CO2')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">CO2</span>
              </div>

              <div :class="['controls_tick_container', settings.individual['N2O']?'':'inactive']" @click="switchIndividual('N2O')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">N2O</span>
              </div>
              
            </div>

          </div>

          <div :class="['controls_box','boxed',settings.data=='world'?'disable':'']">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Emission target <span>(country-level only)</span></span>
            </div>

            <div class="controls_box_body">

              <div class="controls_tick_container inactive">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Base year</span>
              </div>

              <div class="controls_tick_container inactive">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Near-term target</span>
              </div>

              <div class="controls_tick_container inactive">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">BAU 2030</span>
              </div>

              <div class="controls_tick_container inactive">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Long-term target</span>
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
import { getData } from '../import.js'

export default {
  name: 'CurrentEmissionsChart',
  data(){
    return {
      datasets:[],
      datasetsLabel:[],
      labels:[],
      countriesList:["World","China"],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "historical":true,
        "scenario":"Low",
        "greenhouse":{"LULUCF":true,"Non-LULUCF":true,"Total":true},
        "individual":{"CO2eq":true,"CO2":true,"CH4":false,"N2O":false}
      },
      colors:["rgba(0,76,109,1)","rgba(0,103,138,1)","rgba(0,131,166,1)","rgba(0,161,193,1)","rgba(0,192,216,1)","rgba(0,223,237,1)","rgba(0,255,255,1)"],
      bgColors:["rgba(0,76,109,0.3)","rgba(0,103,138,0.3)","rgba(0,131,166,0.3)","rgba(0,161,193,0.3)","rgba(0,192,216,0.3)","rgba(0,223,237,0.3)","rgba(0,255,255,0.3)"],
      chart: undefined
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

    updateData(){
      
      this.labels.length = 0
      this.datasets.length = 0
      this.datasetsLabel.length = 0

      var self = this

      if(self.myData[this.settings["data"]]){

        const byCond = Object.groupBy(self.myData[this.settings["data"]], ({ Conditionality }) => Conditionality);
        Object.keys(byCond).forEach(function(Conditionality){

          byCond[Conditionality] = Object.groupBy(byCond[Conditionality], ({ Sector }) => Sector);

          Object.keys(byCond[Conditionality]).forEach(function(Sector){
            byCond[Conditionality][Sector] = Object.groupBy(byCond[Conditionality][Sector], ({ Pollutant }) => Pollutant);
          })

        })

        Object.keys(byCond[self.settings.scenario]).forEach(function(Sector){

          if(self.settings.greenhouse[Sector]){

            Object.keys(byCond[self.settings.scenario][Sector]).forEach(function(Pollutant){

              var dataset =
                {
                  data: [],
                  type: 'line',
                  backgroundColor: self.bgColors[self.datasets.length],
                  borderColor: self.colors[self.datasets.length],
                  pointRadius: 8,
                  pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                  pointBorderColor: 'rgba(0, 0, 0, 0)',
                  pointHoverRadius: 6
                }

              byCond[self.settings.scenario][Sector][Pollutant].forEach(function(item){
                if (self.settings.historical == false && item["Year"]<2023){
                  return false
                }else{
                  if(!self.labels.includes(item["Year"])){ self.labels.push(item["Year"]) }
                  dataset["data"].push(parseFloat(item["Emissions"]))  
                }
                
              })
              
              if(self.settings.individual[Pollutant]==true){
                self.datasets.push(dataset)
                self.datasetsLabel.push(Pollutant+" "+Sector)
              }
            })
          }
        })
        
      }else{
        getData(store,this.settings["data"])
      }
    },
    createChart(){
      var self = this

      this.updateData()

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

    updateChart () {
      this.updateData()
      this.chart.update()
    },

    switchGreenhouse(gas){
      if(this.settings.greenhouse[gas] == true){
        this.settings.greenhouse[gas] = false
      }else{
        this.settings.greenhouse[gas] = true
      }
    },

    switchHistorical(){
      if(this.settings.historical==true){
        this.settings.historical = false
      }else{
        this.settings.historical = true
      }
    },

    switchIndividual(gas){
      if(this.settings.individual[gas] == true){
        this.settings.individual[gas] = false
      }else{
        this.settings.individual[gas] = true
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
    }
  },

  watch:{
    dataImport:function(){
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
