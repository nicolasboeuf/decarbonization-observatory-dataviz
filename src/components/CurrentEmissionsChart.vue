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
            <div class="controls_dropdown">Global</div>
          </div>

          <div class="controls_box">

            <span class="controls_title">Historical</span>

            <div class="switch_controls_box">
              <div class="switch_container">
                <div class="switch switch_on">
                  <svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                </div>
                <div class="switch switch_off inactive">
                  <svg viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
              </div>
              <span class="switch_label">Historical CO2eq</span>
            </div>

            <div class="switch_controls_box">
              <div class="switch_container">
                <div class="switch switch_on">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                </div>
                <div class="switch switch_off inactive">
                  <svg viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
              </div>
              <span class="switch_label">Historical CO2eq excl. LULUCF</span>
            </div>

          </div>

          <div class="controls_box">

            <span class="controls_title">Reference scenario</span>

            <div class="controls_radio_container">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">Unconditionnal near-term target</span>
            </div>

            <div class="controls_radio_container inactive">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">Unconditionnal near-term target</span>
            </div>

          </div>

          <div class="controls_box">

            <span class="controls_title">Greenhouse gase</span>

            <div class="controls_radio_container">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">CO2eq</span>
            </div>

            <div class="controls_radio_container inactive">
              <div class="radio">
                <div class="radio_inner"></div>
              </div>
              <span class="radio_label">CO2eq excl. LULUCF</span>
            </div>

          </div>

          <div class="controls_box boxed">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Individual gases contribution</span>
            </div>

            <div class="controls_box_body">

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">CO2eq LULUCF</span>
              </div>

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">CH4</span>
              </div>

              <div class="controls_radio_container inactive">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">CO2eq excl. LULUCF</span>
              </div>

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">N20</span>
              </div>
              
            </div>

          </div>

          <div class="controls_box boxed">

            <div class="controls_box_header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
              <span class="controls_box_header_title">Emission target <span>(country-level only)</span></span>
            </div>

            <div class="controls_box_body">

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">Base year</span>
              </div>

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">Near-term target</span>
              </div>

              <div class="controls_radio_container inactive">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">BAU 2030</span>
              </div>

              <div class="controls_radio_container">
                <div class="radio">
                  <div class="radio_inner"></div>
                </div>
                <span class="radio_label">Long-term target</span>
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

export default {
  name: 'CurrentEmissionsChart',
  data(){
    return {
      datasets:[
        {
          data: [1,2,3,1],
          type: 'line',
          backgroundColor: "#FF5733",
          borderColor: "#FF5733",
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverRadius: 6
        },
        {
          data: [2,3,1,2],
          type: 'line',
          backgroundColor: "#33FF62",
          borderColor: "#33FF62",
          pointRadius: 8,
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverRadius: 6
        },
      ],
      labels:["test1","test2","test3","test4"]
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
    filterData(){
      console.log(this.myData)
      this.createChart()
    },
    createChart(){
      var self = this
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
                maxTicksLimit: 3,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value) {
                  return value
                }
              }
            }],
            yAxes: [{
              gridLines: {
                color: '#e5e5e5',
                borderDash: [3]
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
              },
            }]
          },
          legend: {
            display: false
          },
        }
      })
    }
  },

  watch:{
    dataImport:function(){
      this.filterData()
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
