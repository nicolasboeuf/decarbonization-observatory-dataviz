<template>
  <div id="impactScenariosChart" class="chartComponent">
    <h2>Individual impact of each enhanced and delayed pledge</h2>
    <h3>Visualize the individual impact of each enhanced and delayed pledge</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="impactScenarios_chart"></canvas>
        <div id="nodataModale" v-if="chart&&datasets.length===0">
          <span>No vizualisation available with this data selection</span>
        </div>
      </div>
      <div class="controlsSpace">
        <div class="controlsWrapper">

        <a download :href="customUrl"><div class="downloadBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg></div></a>

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
            <span class="radio_label">Unconditional near-term targets and net-zero targets</span>
          </div>

          <div :class="['controls_radio_container',settings.scenario=='Low'?'inactive':'']" @click="settings.scenario='High'">
            <div class="radio">
              <div class="radio_inner"></div>
            </div>
            <span class="radio_label">Conditional near-term targets and net-zero targets</span>
          </div>

        </div>

        <div class="controls_box">
          
          <span class="controls_title">Select one or more pledge(s)</span>

          <div class="controls_select_all_container">
            <div class="select_all_btn" @click="selectAllPledges()">Select all</div>
            <div class="select_all_btn" @click="selectNoPledges()">Select none</div>
          </div>

          <div class="controls_multiple_tick_container">
              
            <div v-for="s in settings.pledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)">
              <div class="tick" :style="settings.selectedPledges.includes(s)&&config['scenarios']?{backgroundColor: config['scenarios'][s]['color']}:{backgroundColor:'#fff'}">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">
                {{s}}
                <div class="info_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
                  <div class="info_modale" v-if="config['scenarios']">{{config['scenarios'][s]['desc']}}</div>
                </div>
              </span>


            </div>

          </div>

        </div>

      </div>

      </div>
    </div>
    <div class="chart_legend">
      <span class="chart_legend_txt">Visualize the impact of enhanced or delayed scenarios comparing to base</span>
      <div class="chart_legend_btn" @click="toggleDrawer()">
        <span v-if="openDrawer==false">Read more</span>
        <span v-if="openDrawer==true">Read less</span>
      </div>
    </div>
    <div :class="['chart_drawer',openDrawer?'open':'close']">
      <span class="chart_drawer_text">Country-specific scenarios of the future evolution of emissions based on national climate pledges. Red dots represent national climate pledges of each country. A simple mathematical function was applied to extend emissions scenarios from the most recent emission level to the 2030 target level, mid-century net-zero target level and beyond.</span>
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
      openDrawer:false,
      chart: undefined,
      datasets:[],
      datasetsLabel:[],
      labels:[],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "value":"emissions",
        "variable":"CO2eq_Non-LULUCF",
        "scenario":"Low",
        "pledges":["NDC01","NDC02","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","LTS05","LTS06","LUF01","LUF02","LUF03","N2O++","CH4++","NoGMP","selMIT"],
        "selectedPledges":["NDC01","NDC02","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","LTS05","LTS06","LUF01","LUF02","LUF03","N2O++","CH4++","NoGMP","selMIT"],
      }
    }
  },
  props: {
  },
  computed: {
    config(){
      return store.state.config
    },
    impactScenariosDataEndImport() {
      return store.state.impactScenariosDataEndImport
    },
    impactScenariosData(){
      return store.state.impactScenariosData
    },
    customUrl(){
      return "https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/impact_scenarios/"+this.settings.data+".json"
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

        // get Scenario from Data
        //console.log(Object.keys(byVariable[self.settings.variable]))

        Object.keys(byVariable[self.settings.variable]).forEach(function(pledge){

          if(self.settings.selectedPledges.includes(pledge)){

            var bgColor
            var borderColor

            if(self.config["scenarios"][pledge]){
              borderColor = self.config["scenarios"][pledge]["color"]
              bgColor = self.config["scenarios"][pledge]["color"].replace(",1)",",0.6)")
            }else{
              borderColor = "rgba(0,0,0,1)"
              bgColor = "rgba(0,0,0,0)"
            }

            var dataset =
              {
                data: [],
                type: 'line',
                backgroundColor: bgColor,
                borderColor: borderColor,
                pointRadius: 15,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverRadius: 15,
                fill:"origin"
              }

            byVariable[self.settings.variable][pledge].forEach(function(item){
              if(!self.labels.includes(item["Year"])){ self.labels.push(item["Year"]) }
              if(self.settings.variable == "dT"){
                dataset["data"].push(parseFloat(item["Value"]))  
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
                color: 'rgba(0, 0, 0, 0.05)',
                borderDash: [0],
                z:-1
              },
              scaleLabel:{
                display:true,
                labelString:"CO2eq",
              },
              ticks: {
                autoSkip: false,
                maxTicksLimit: 15,
                beginAtZero: true,
                callback: function (value) {
                  var v
                  if(value>1000000||value<-1000000){
                    v = value/1000000+" Gtons"
                  }else if(value>1000||value<-1000){
                    v = value/1000+" Mtons"
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
                var value
                if(self.settings.value == "emissions"){
                  value = parseInt(tooltipItem["value"]).toLocaleString()+"tons CO2eq"
                }else{
                  value = parseFloat(tooltipItem["value"]).toLocaleString()+" °C"
                }
                return(value)
              },
              labelColor: function(tooltipItem) {
                var c
                if(self.config["scenarios"][self.settings.selectedPledges[tooltipItem["datasetIndex"]]]){
                  c = self.config["scenarios"][self.settings.selectedPledges[tooltipItem["datasetIndex"]]]["color"]
                }else{
                  c = "rgba(1,1,1,1)"
                }
                return {
                  borderColor: c,
                  backgroundColor: c,
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
        this.settings.variable = "CO2eq_Non-LULUCF"
      }
    },

    filterOptions() {
      this.filtredCountry = this.config["countries"].filter(option => {
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
      this.filtredCountry = this.config["countries"]
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

    selectAllPledges(){
      this.settings.selectedPledges = this.settings.pledges
    },

    selectNoPledges(){
      this.settings.selectedPledges = []
    },

    updateChart () {
      this.updateData()
      this.chart.update()
      if(this.settings.variable == "CO2eq_Non-LULUCF"){
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "CO2eq"
      }else{
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "Global-mean temperature change relative to 1850-1900 (°C)"
      }
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
    impactScenariosDataEndImport:function(){
      if(this.chart){
        this.updateChart()
      }else{
        this.createChart()
      }
    },
    /*configEndImport:function(){
      this.updateChart()
    },*/
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
