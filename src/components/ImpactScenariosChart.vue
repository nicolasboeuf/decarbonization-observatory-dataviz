<template>
  <div id="impactScenariosChart" class="chartComponent">
    <h2>Individual impact of each enhanced and delayed pledge</h2>
    <h3>Visualize the individual impact of each enhanced and delayed pledge</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="impactScenarios_chart"></canvas>
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
              
            <div v-for="s,i in settings.pledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)">
              <div class="tick" :style="settings.selectedPledges.includes(s)?{backgroundColor: colors[i]}:{backgroundColor:'#fff'}">
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
      countriesList:["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Congo_the Democratic Republic of the","Cook Islands","Costa Rica","Cote d'Ivoire","Cuba","Djibouti","Dominica","Dominican Republic","EU27","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Fiji","Gabon","Gambia","Georgia","Ghana","Grenada","Guatemala","Guinea-Bissau","Guinea","Guyana","Haiti","Honduras","Iceland","India","Indonesia","Int. Aviation","Int. Shipping","Iran, Islamic Republic of","Iraq","Israel","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Macedonia, the former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Qatar","Russian Federation","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Solomon Islands","Somalia","South Africa","South Sudan","Sri Lanka","Sudan","Suriname","Switzerland","Syrian Arab Republic","Tajikistan","Tanzania_United Republic of","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","World","Yemen","Zambia","Zimbabwe"],
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
      },
      colors:["rgba(134,18,134,1)","rgba(252,43,157,1)","rgba(184,25,59,1)","rgba(252,100,58,1)","rgba(32,68,121,1)","rgba(46,115,179,1)","rgba(93,162,206,1)","rgba(150,174,237,1)","rgba(190,213,255,1)","rgba(110,178,223,1)","rgba(93,183,113,1)","rgba(55,146,79,1)","rgba(0,111,48,1)","rgba(217,3,104,1)","rgba(255,212,0,1)","rgba(226,212,183,1)","rgba(238,99,82,1)"],
      bgColors:["rgba(134,18,134,0.6)","rgba(252,43,157,0.6)","rgba(184,25,59,0.6)","rgba(252,100,58,0.6)","rgba(32,68,121,0.6)","rgba(46,115,179,0.6)","rgba(93,162,206,0.6)","rgba(150,174,237,0.6)","rgba(190,213,255,0.6)","rgba(110,178,223,0.6)","rgba(93,183,113,0.6)","rgba(55,146,79,0.6)","rgba(0,111,48,0.6)","rgba(217,3,104,0.6)","rgba(255,212,0,0.6)","rgba(226,212,183,0.6)","rgba(238,99,82,0.6)"],
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

        console.log(Object.keys(byVariable[self.settings.variable]))

        Object.keys(byVariable[self.settings.variable]).forEach(function(pledge){

          if(self.settings.selectedPledges.includes(pledge)){

            var dataset =
              {
                data: [],
                type: 'line',
                backgroundColor: self.bgColors[self.settings.pledges.indexOf(pledge)],
                borderColor: self.colors[self.settings.pledges.indexOf(pledge)],
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
        this.settings.variable = "CO2eq_Non-LULUCF"
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
