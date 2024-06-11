<template>
  <div id="combinedImpactChart" class="chartComponent">
    <h2>Combined impact of enhanced or delayed pledges</h2>
    <h3>Visualize the impact of combined impact of enhanced or delayed pledges on the reference scenario</h3>
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

        <!-- <div class="controls_box">

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

        </div> -->

        <div class="controls_box">

          <span class="controls_title">Type of pledges</span>

          <div :class="['controls_radio_container',settings.pledgesType=='delayed'?'inactive':'']" @click="togglePledgesType('enhanced')">
            <div class="radio">
              <div class="radio_inner"></div>
            </div>
            <span class="radio_label">Enhanced</span>
          </div>

          <div :class="['controls_radio_container',settings.pledgesType=='enhanced'?'inactive':'']" @click="togglePledgesType('delayed')">
            <div class="radio">
              <div class="radio_inner"></div>
            </div>
            <span class="radio_label">Delayed</span>
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
              
            <div v-for="s,i in filtredPledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)"> 
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
      countriesList:["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Congo_the Democratic Republic of the","Cook Islands","Costa Rica","Cote d'Ivoire","Cuba","Djibouti","Dominica","Dominican Republic","EU27","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Fiji","Gabon","Gambia","Georgia","Ghana","Grenada","Guatemala","Guinea-Bissau","Guinea","Guyana","Haiti","Honduras","Iceland","India","Indonesia","Int. Aviation","Int. Shipping","Iran, Islamic Republic of","Iraq","Israel","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Macedonia, the former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Qatar","Russian Federation","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Solomon Islands","Somalia","South Africa","South Sudan","Sri Lanka","Sudan","Suriname","Switzerland","Syrian Arab Republic","Tajikistan","Tanzania_United Republic of","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","World","Yemen","Zambia","Zimbabwe"],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      settings:{
        "data":"world",
        "value":"emissions",
        "variable":"CO2eq",
        "scenario":"Low",
        "pledges":["NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01","LUF02","LUF03"],
        "selectedPledges":["Low","High","NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01"],
        "delayedPledges":["NDC02","LTS04","LTS06"],
        "enhancedPledges":["NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01","LUF02","LUF03"],
        "pledgesType":"enhanced"
      },
      colors:["rgba(1, 1, 1, 1)","rgba(1, 1, 1, 1)","rgba(134,18,134,1)","rgba(184,25,59,1)","rgba(252,100,58,1)","rgba(255,212,0,1)","rgba(217,3,104,1)","rgba(32,68,121,1)","rgba(46,115,179,1)","rgba(93,162,206,1)","rgba(190,213,255,1)","rgba(93,183,113,1)","rgba(55,146,79,1)","rgba(0,111,48,1)"],
      //colors:["rgba(146, 221, 248, 0)","rgba(246, 91, 68, 0)","rgba(134,18,134,0)","rgba(184,25,59,0)","rgba(252,100,58,0)","rgba(255,212,0,0)","rgba(217,3,104,0)","rgba(32,68,121,0)","rgba(46,115,179,0)","rgba(93,162,206,0)","rgba(190,213,255,0)","rgba(93,183,113,0)","rgba(55,146,79,0)","rgba(0,111,48,0)"],
      bgColors:["rgba(146, 221, 248, 0.6)","rgba(246, 91, 68, 0.6)","rgba(134,18,134,0.6)","rgba(184,25,59,0.6)","rgba(252,100,58,0.6)","rgba(255,212,0,0.6)","rgba(217,3,104,0.6)","rgba(32,68,121,0.6)","rgba(46,115,179,0.6)","rgba(93,162,206,0.6)","rgba(190,213,255,0.6)","rgba(93,183,113,0.6)","rgba(55,146,79,0.6)","rgba(0,111,48,0.6)"],
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
    },
    filtredPledges(){
      var pledges
      if(this.settings.data == "world"){
        if(this.settings.pledgesType == "enhanced"){
          pledges = this.settings.enhancedPledges
        }else{
          pledges = this.settings.delayedPledges
        }
      }else{
        if(this.settings.pledgesType == "enhanced"){
          pledges = this.settings.pledges.filter(e => e !== 'LUF01').filter(e => e !== 'LUF02').filter(e => e !== 'LUF03')
        }else{
          pledges = this.settings.delayedPledges
        }
      }
      return pledges
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

            var dash = [0]
            if(p === "Low" || p === "High"){
              dash = [5]
            }

            var background = self.bgColors[self.datasets.length]
            if(p === "Low" || p === "High"){
              background = 'rgba(999, 999, 999, 1)'
            }

            var dataset =
              {
                data: [],
                type: 'line',
                borderDash: dash,
                backgroundColor:  background,
                borderColor: self.colors[self.datasets.length],
                pointRadius: 15,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointHoverRadius: 15,
                order:j
              }

            if(self.settings.pledgesType == "enhanced"){
              dataset.fill = "end"
            }else{
              dataset.fill = "start"
            }

            var preservedDataset = { data : [] }

            byVariable[self.settings.variable].forEach(function(pledge,i){
              var d = parseFloat(String(pledge[p]).replace(",","."))
              preservedDataset["data"].push(d)
              if(j==1)
                {d = d + self.datasets[j-1]["data"][i]
              }else if(j>1){
                if(self.settings.pledgesType == "enhanced"){
                  d = d + self.datasets[j-1]["data"][i]
                }else{
                  if(j == 2){
                    d = d + self.datasets[0]["data"][i]
                  }else{
                    d = d + self.datasets[j-1]["data"][i]
                  }
                }
              }
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
                color: 'rgba(0, 0, 0, 0.05)',
                borderDash: [0],
                z:10
              },
              scaleLabel:{
                display:true,
                labelString:"CO2eq",
              },
              ticks: {
                autoSkip: true,
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
        this.settings.variable = "CO2eq"
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
            if(s == "LUF01"){
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF02");
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF03");
            }
            if(s == "LUF02"){
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF01");
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF03");
            }
            if(s == "LUF03"){
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF01");
              this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF02");
            }
          }
        }
      }
    },

    togglePledgesType(type){
      if(type=="enhanced"){
        this.settings.pledgesType = "enhanced"
        this.settings.pledges = this.settings.enhancedPledges
        this.settings.selectedPledges = ["Low","High","NDC01","GMP01","GMP02","CH4++","N2O++","LTS01","LTS02","LTS03","LTS05","LUF01"]
      }else{
        this.settings.pledgesType = "delayed"
        this.settings.pledges = this.settings.delayedPledges
        this.settings.selectedPledges = ["Low","High","NDC02","LTS04","LTS06"]
      }
    },

    updateChart () {
      this.updateData()
      this.chart.update()
      if(this.settings.variable == "CO2eq"){
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "CO2eq"
      }else{
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = "Global-mean temperature change relative to 1850-1900 (°C)"
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
