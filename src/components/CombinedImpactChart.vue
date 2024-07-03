<template>
  <div id="combinedImpactChart" class="chartComponent">
    <h2>Combined impact of enhanced or delayed pledges</h2>
    <h3>Visualize the impact of combined impact of enhanced or delayed pledges on the reference scenario</h3>
    <div class="componentSpace">
      <div class="chartSpace">
        <canvas id="combinedImpact_chart"></canvas>
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
          
          <span class="controls_title">Add one or more pledge(s)</span>
          <span class="controls_subtitle">LUF pledges can not be added at once</span>

          <div class="controls_select_all_container">
            <div class="select_all_btn" @click="selectAllPledges()">Select all</div>
            <div class="select_all_btn" @click="selectNoPledges()">Select none</div>
          </div>

          <div class="controls_multiple_tick_container sequential">

            <div class="controls_tick_container">
              <div class="tick">
                <div class="tick_inner"></div>
              </div>
              <span class="tick_label">Reference
                <div class="info_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
                  <div class="info_modale">Description to add</div>
                </div>
              </span>
            </div>
              
            <div v-for="s in filtredPledges" :key="s" :class="['controls_tick_container',settings.selectedPledges.includes(s)?'':'inactive']" @click="togglePledge(s)"> 
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
      <span class="chart_legend_txt">Visualize the combined impact of enhanced or delayed scenarios comparing to base</span>
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
import { getCombinedImpactData } from '../import.js'

export default {
  name: 'CombinedImpactChart',
  data(){
    return {
      openDrawer:false,
      chart: undefined,
      datasets:[],
      preservedDatasets:[],
      datasetsLabel:[],
      labels:[],
      filtredCountry:[],
      showDropdown: false,
      searchString:'World',
      delayedPledges:[],
      enhancedPledges:[],
      pledges:[],
      settings:{
        "data":"World",
        "value":"emissions",
        "variable":"CO2eq",
        "scenario":"Low",
        "selectedPledges":[],
        "pledgesType":"enhanced"
      }
    }
  },
  props: {
  },
  computed: {
    config(){
      return store.state.config
    },
    combinedImpactDataEndImport() {
      return store.state.combinedImpactDataEndImport
    },
    combinedImpactData(){
      return store.state.combinedImpactData
    },
    filtredPledges(){
      var pledges
      
      if(this.settings.pledgesType == "enhanced"){
        pledges = this.enhancedPledges
      }else{
        pledges = this.delayedPledges
      }
     
      return pledges

    },
    customUrl(){
      return "https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/combined_impact/"+this.settings.data+".json"
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

        self.updatePledges()

        const byVariable = Object.groupBy(self.combinedImpactData[self.settings["data"]], ({ Variable }) => Variable);

        
        byVariable[self.settings.variable].forEach(function(pledge){

          if(!self.labels.includes(pledge["Year"])){ self.labels.push(pledge["Year"]) }

        })

        self.settings.selectedPledges.forEach(function(p,j){

            var dash = [0]
            if(p === "Low" || p === "High"){
              dash = [5]
            }

            var background
            var border

            if(self.config["scenarios"][p]){
              border = self.config["scenarios"][p]["color"]
              background = self.config["scenarios"][p]["color"].replace(",1)",",1)")
            }else{
              border = 'rgba(999, 999, 999, 1)'
              background = 'rgba(999, 999, 999, 1)'
            }
            if(p === "Low" || p === "High"){
              background = 'rgba(999, 999, 999, 1)'
              border = 'rgba(1, 1, 1, 1)'
            }

            var dataset =
              {
                data: [],
                type: 'line',
                borderDash: dash,
                backgroundColor:  background,
                borderColor: border,
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

    updatePledges(){
      var self = this

      this.pledges = []
      this.delayedPledges = []
      this.enhancedPledges = []

      const byVariable = Object.groupBy(self.combinedImpactData[self.settings["data"]], ({ Variable }) => Variable);

      Object.keys(byVariable["CO2eq"][0]).forEach(function(p){
        
        if(p != "Year" && p != "Low" && p != "High" && p != "Variable"){
          if(self.config["scenarios"][p]["type"] == "enhanced"){
            self.enhancedPledges.push(p)
            self.pledges.push(p)
          }else{
            self.delayedPledges.push(p)
          }
          
        }

      })

    },

    createChart(){
      var self = this

      this.updateData()

      this.selectAllPledges()

      const ctx = document.getElementById("combinedImpact_chart").getContext('2d')
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
                beginAtZero: false,
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
                var value
                if(self.settings.value == "emissions"){
                  value = parseInt(self.preservedDatasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString()+" tonnes CO2eq"
                }else{
                  value = parseFloat(self.preservedDatasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString()+" °C"
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
        this.settings.variable = "CO2eq"
      }
    },

    filterOptions() {
      this.filtredCountry = this.config["countries"].filter(option => {
        return option.toLowerCase().includes(this.searchString.toLowerCase());
      });
      this.showDropdown = true;
    },
    selectOption(option) {
      this.settings.data = option
      this.searchString = option
      this.showDropdown = false;
    },
    focusInput(){
      this.searchString=""
      this.showDropdown=true
      this.filtredCountry = this.config["countries"]
    },

    togglePledge(s){

      var index = this.pledges.indexOf(s)
      var l = this.pledges.length

      if(this.settings.selectedPledges.includes(s)){
        for(var i = l;i>=index;i--){
          this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== this.pledges[i]);
        }
      }else{
        for(var j = 0;j<=index;j++){
          if(!this.settings.selectedPledges.includes(this.pledges[j])){
            this.settings.selectedPledges.push(this.pledges[j]);
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
        this.pledges = this.enhancedPledges
        this.settings.selectedPledges = this.enhancedPledges
        this.settings.selectedPledges.unshift("Low","High")
        this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF02");
        this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF03");
      }else{
        this.settings.pledgesType = "delayed"
        this.pledges = this.delayedPledges
        this.settings.selectedPledges = this.delayedPledges
        this.settings.selectedPledges.unshift("Low","High")
      }
    },

    selectAllPledges(){
      if(this.settings.pledgesType == "enhanced"){
        this.settings.selectedPledges = this.enhancedPledges
        this.settings.selectedPledges.unshift("Low","High")
        this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF02");
        this.settings.selectedPledges = this.settings.selectedPledges.filter(e => e !== "LUF03");
      }else{
        this.settings.selectedPledges = this.delayedPledges
        this.settings.selectedPledges.unshift("Low","High")
      }
    },

    selectNoPledges(){
      this.settings.selectedPledges = ["Low","High"]
    },

    updateChart () {
      this.updateData()
      this.chart.update()
      if(this.settings.variable == "CO2eq"){
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
