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
      countriesList:["afghanistan","albania","algeria","andorra","angola","antigua and barbuda","argentina","armenia","australia","azerbaijan","bahamas","bahrain","bangladesh","barbados","belarus","belize","benin","bhutan","bolivia","bosnia and herzegovina","botswana","brazil","brunei darussalam","burkina faso","burundi","cambodia","cameroon","canada","cape verde","central african republic","chad","chile","china","colombia","comoros","congo","congo_the democratic republic of the","cook islands","costa rica","cote d'ivoire","cuba","djibouti","dominica","dominican republic","ecuador","egypt","el salvador","equatorial guinea","eritrea","eswatini","ethiopia","eu27","fiji","gabon","gambia","georgia","ghana","grenada","guatemala","guinea-bissau","guinea","guyana","haiti","honduras","iceland","india","indonesia","int. aviation","int. shipping","iran, islamic republic of","iraq","israel","jamaica","japan","jordan","kazakhstan","kenya","kiribati","korea, democratic people's republic of","korea, republic of","kuwait","kyrgyzstan","lao people's democratic republic","lebanon","lesotho","liberia","libyan arab jamahiriya","liechtenstein","macedonia, the former yugoslav republic of","madagascar","malawi","malaysia","maldives","mali","marshall islands","mauritania","mauritius","mexico","micronesia, federated states of","moldova, republic of","monaco","mongolia","montenegro","morocco","mozambique","myanmar","namibia","nauru","nepal","new zealand","nicaragua","niger","nigeria","niue","norway","oman","pakistan","palau","palestine","panama","papua new guinea","paraguay","peru","philippines","qatar","russian federation","rwanda","saint kitts and nevis","saint lucia","saint vincent and the grenadines","samoa","sao tome and principe","saudi arabia","senegal","serbia","seychelles","sierra leone","singapore","solomon islands","somalia","south africa","south sudan","sri lanka","sudan","suriname","switzerland","syrian arab republic","tajikistan","tanzania_united republic of","thailand","timor-leste","togo","tonga","trinidad and tobago","tunisia","turkey","turkmenistan","tuvalu","uganda","ukraine","united arab emirates","united kingdom","united states","uruguay","uzbekistan","vanuatu","venezuela","viet nam","world","yemen","zambia","zimbabwe"],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "value":"emissions",
        "variable":"CO2eq_Non-LULUCF",
        "scenario":"Low",
        "pledges":["NDC01","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","CH4++","N2O++"],
        "selectedPledges":["NDC01","GMP01","GMP02","LTS01","LTS02","LTS03","LTS04","CH4++","N2O++"],
      },
      colors:["rgba(252,43,157,1)","rgba(140,25,140,1)","rgba(183,22,58,1)","rgba(252,107,67,1)","rgba(254,179,91,1)","rgba(255,228,141,1)","rgba(32,68,121,1)","rgba(46,115,179,1)","rgba(93,183,113,1)"],
      bgColors:["rgba(252,43,157,0.6)","rgba(140,25,140,0.6)","rgba(183,22,58,0.6)","rgba(252,107,67,0.6)","rgba(254,179,91,0.6)","rgba(255,228,141,0.6)","rgba(32,68,121,0.6)","rgba(46,115,179,0.6)","rgba(93,183,113,0.6)"],
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
                  value = parseInt(tooltipItem["value"]).toLocaleString()+" tonnes CO2eq"
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

    updateChart () {
      this.updateData()
      this.chart.update()
      if(this.settings.variable == "CO2eq_Total"){
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "tons CO2eq"
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
