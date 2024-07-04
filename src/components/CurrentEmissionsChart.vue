<template>
  <div id="currentEmissionsChart" class="chartComponent">
    <h2 v-if="config['texts']" v-html="config['texts']['current-emissions']['title']"></h2>
    <h3 v-if="config['texts']" v-html="config['texts']['current-emissions']['subtitle']"></h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="currentEmissions_chart"></canvas>
        <div id="nodataModale" v-if="chart&&datasets.length===0">
          <span>No vizualisation available with this data selection</span>
        </div>
      </div>
      <div class="controlsSpace">

        <div class="controlsWrapper">

          <a download :href="customUrl"><div class="downloadBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg></div></a>

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

            <span class="controls_title">Historical emissions</span>

            <div class="switch_controls_box" @click="switchHistorical()">
              <div class="switch_container">
                <div :class="['switch switch_on',settings.historical?'':'inactive']">
                  <svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                </div>
                <div :class="['switch switch_on',settings.historical?'inactive':'']">
                  <svg viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
              </div>
              <span class="switch_label">Show historical emissions</span>
            </div>

          </div>

          <div class="controls_box">

            <span class="controls_title">Reference scenario</span>

            <div :class="['controls_radio_container',settings.scenario=='High'?'inactive':'']" @click="settings.scenario='Low'">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">Unconditional near-term targets and net-zero targets</span>
            </div>

            <div :class="['controls_radio_container',settings.scenario=='Low'?'inactive':'']" @click="settings.scenario='High'">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">Conditional near-term targets and net-zero targets</span>
            </div>

          </div>

          <div class="controls_box boxed">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Sectors</span>
            </div>

            <div class="controls_box_body sectors_box">

              <div :class="['controls_tick_container', settings.greenhouse['Non-LULUCF']?'':'inactive']" @click="switchGreenhouse('Non-LULUCF')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Energy; Industrial Processes; Solvent and Other Product Use; Agriculture</span>
              </div>

              <div :class="['controls_tick_container', settings.greenhouse['LULUCF']?'':'inactive', settings.data!='world'?'disable inactive':'']" @click="switchGreenhouse('LULUCF')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Land Use, Land-Use Change and Forestry (LULUCF)</span>
              </div>

              <div :class="['controls_tick_container', settings.greenhouse['Total']?'':'inactive']" @click="switchGreenhouse('Total')">
                <div class="tick">
                  <div class="tick_inner"></div>
                </div>
                <span class="tick_label">Total</span>
              </div>

            </div>

          </div>

          <div class="controls_box boxed">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Greenhouse gases</span>
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

          <!-- <div :class="['controls_box','boxed','disable']">

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

          </div> -->

        </div>

      </div>
    </div>
    <div class="chart_legend">
      <span class="chart_legend_txt" v-if="config['texts']" v-html="config['texts']['current-emissions']['legend-short']"></span>
      <div class="chart_legend_btn" @click="toggleDrawer()">
        <span v-if="openDrawer==false">Read more</span>
        <span v-if="openDrawer==true">Read less</span>
      </div>
    </div>
    <div :class="['chart_drawer',openDrawer?'open':'close']">
      <span class="chart_drawer_text" v-if="config['texts']" v-html="config['texts']['current-emissions']['legend-long']"></span>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { Chart } from 'chart.js'
import { getCurrentEmissionsData } from '../import.js'

export default {
  name: 'CurrentEmissionsChart',
  data(){
    return {
      openDrawer:false,
      datasets:[],
      datasetsLabel:[],
      labels:[],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"World",
        "historical":true,
        "scenario":"Low",
        "greenhouse":{"LULUCF":false,"Non-LULUCF":false,"Total":true},
        "individual":{"CO2eq":true,"CO2":false,"CH4":false,"N2O":false}
      },
      colors:["rgba(0,76,109,1)","rgba(0,103,138,1)","rgba(0,131,166,1)","rgba(0,161,193,1)","rgba(0,192,216,1)","rgba(0,223,237,1)","rgba(0,255,255,1)"],
      bgColors:["rgba(0,76,109,0.1)","rgba(0,103,138,0.1)","rgba(0,131,166,0.1)","rgba(0,161,193,0.1)","rgba(0,192,216,0.1)","rgba(0,223,237,0.1)","rgba(0,255,255,0.1)"],
      chart: undefined
    }
  },
  props: {
  },
  computed: {
    config() {
      return store.state.config
    },
    configEndImport() {
      return store.state.configEndImport
    },
    currentEmissionsDataEndImport() {
      return store.state.currentEmissionsDataEndImport
    },
    currentEmissionsData(){
      return store.state.currentEmissionsData
    },
    customUrl(){
      return "https://raw.githubusercontent.com/nicolasboeuf/decarbonization-observatory-data/master/current_emissions/"+this.settings.data+".json"
    }
  },
  methods: {

    updateData(){
      
      this.labels.length = 0
      this.datasets.length = 0
      this.datasetsLabel.length = 0

      var self = this

      if(self.currentEmissionsData[this.settings["data"]]){

        const byCond = Object.groupBy(self.currentEmissionsData[this.settings["data"]], ({ Conditionality }) => Conditionality);
        Object.keys(byCond).forEach(function(Conditionality){

          byCond[Conditionality] = Object.groupBy(byCond[Conditionality], ({ Sector }) => Sector);

          Object.keys(byCond[Conditionality]).forEach(function(Sector){
            byCond[Conditionality][Sector] = Object.groupBy(byCond[Conditionality][Sector], ({ Pollutant }) => Pollutant);
          })

        })

        Object.keys(byCond[self.settings.scenario]).forEach(function(Sector){

          if(self.settings.greenhouse[Sector]){

            Object.keys(byCond[self.settings.scenario][Sector]).forEach(function(Pollutant){

              const ctx = document.getElementById("currentEmissions_chart").getContext('2d')
              var gradientFill

              gradientFill = ctx.createLinearGradient(0, 0, 0, 442)
              gradientFill.addColorStop(0, self.colors[self.datasets.length])
              gradientFill.addColorStop(1, 'rgba(245, 245, 255, 0)')

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
        getCurrentEmissionsData(store,this.settings["data"])
      }
    },

    createChart(){
      var self = this

      this.updateData()

      const ctx = document.getElementById("currentEmissions_chart").getContext('2d')
      this.chart = new Chart(ctx, {
        data: {
          labels: self.labels,
          datasets: self.datasets
        },
        options: {
          maintainAspectRatio: false,
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
                color: 'rgba(0, 0, 0, 0.05)',
                borderDash: [0]
              },
              scaleLabel:{
                display:true,
                labelString:"Emissions",
              },
              ticks: {
                autoSkip: false,
                maxTicksLimit: 15,
                beginAtZero: true,
                callback: function (value) {
                  var v
                  if(value>1000000||value<-1000000){
                    v = value/1000000+" Gtons/year"
                  }else if(value>1000||value<-1000){
                    v = value/1000+" Mtons/year"
                  }else{
                    v = value
                  }
                  return v
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
                var value = parseInt(tooltipItem["value"]).toLocaleString()
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
      this.filtredCountry = this.config["countries"].filter(option => {
        return option.toLowerCase().includes(this.searchString.toLowerCase());
      });
      this.showDropdown = true;
    },
    selectOption(option) {
      this.settings.data = option;
      this.searchString = option
      this.showDropdown = false;
    },
    focusInput(){
      this.searchString=""
      this.showDropdown=true
      this.filtredCountry = this.config["countries"]
    },
    toggleDrawer(){
      if(this.openDrawer == true){
        this.openDrawer = false
      }else{
        this.openDrawer = true
      }
    }
  },

  watch:{
    currentEmissionsDataEndImport:function(){
      if(this.chart){
        this.updateChart()
      }else{
        this.createChart()
      }
    },
    configEndImport:function(){
      
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
