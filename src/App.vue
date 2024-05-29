<template>
  <div id="app">
    <h1>Decarbonization Observatory: target-based global and national scenarios</h1>
    <CurrentEmissionsChart></CurrentEmissionsChart>
    <GlobalTemperatureChart></GlobalTemperatureChart>
    <ImpactScenariosChart></ImpactScenariosChart>
    <CombinedImpactChart></CombinedImpactChart>
  </div>
</template>

<script>

import CurrentEmissionsChart from './components/CurrentEmissionsChart.vue'
import GlobalTemperatureChart from './components/GlobalTemperatureChart.vue'
import ImpactScenariosChart from './components/ImpactScenariosChart.vue'
import CombinedImpactChart from './components/CombinedImpactChart.vue'
import store from '@/store'
import { getCurrentEmissionsData } from './import.js'
import { getGlobalTempData } from './import.js'
import { getImpactScenariosData } from './import.js'
import { getCombinedImpactData } from './import.js'

export default {
  name: 'App',
  components: {
    CurrentEmissionsChart,
    GlobalTemperatureChart,
    ImpactScenariosChart,
    CombinedImpactChart
  },

  computed: {
    
  },

  watch:{

  },
  
  created(){
    getCurrentEmissionsData(store,"world")
    getGlobalTempData(store)
    getImpactScenariosData(store,"world")
    getCombinedImpactData(store,"world")
  }
}
</script>

<style lang="scss">

@import "../css/variables.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  h1{
    font-family: "barlow-bold";
    font-size:21px;
    background:$semiGradientDark;
    display: inline-block;
    padding: 5px 25px 5px 25px;
    box-sizing: border-box;
    color:white;
    border-radius: 15px;
  }
  h2{
    color:$mediumBlue;
    font-family: "barlow-bold";
    font-size:17px;
  }
  h3{
    font-family: "DMSans-Regular";
    font-size:11px;
  }
  .chartComponent{
    width: 100%;
    height:700px;
    margin-bottom: 250px;
    position: relative;
    .componentSpace{
      position: relative;
      .chartSpace{
        position: relative;
        width: 70%;
        height: 700px;
        display: inline-block;
        #nodataModale{
          position: absolute;
          width: 30%;
          height: 30%;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          border:2px solid $deepBlue;
          background-color: white;
          border-radius: 5px;
          text-align: center;
          span{
            font-size: 24px;
            position: relative;
            top:75px;
          }
        }
      }
      .controlsSpace{
        position: relative;
        width: 30%;
        min-height: 700px;
        display: inline-block;
        box-sizing: border-box;
        .controlsWrapper{
          position: absolute;
          width: 90%;
          left:50%;
          transform:translate(-50%,0);
          .controls_box{
            width: 100%;
            display: block;
            margin-bottom: 15px;
            .controls_title{
              font-family: "barlow-semibold";
              font-size:17px;
              margin-bottom: 10px;
              display: block;
            }
            .controls_dropdown {
              position: relative;
              cursor: pointer;
              height: 28px;
              &:after{
                content:"";
                position: absolute;
                left:65%;
                top: 50%;
                transform:translate(0,-5px);
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 10px solid black;
                clear: both;
              }
              &:hover{
                &:after{
                  opacity: 0.8;
                }
              }
              .dropdown-input {
                width: 65%;
                height: 28px;
                border-radius: 20px;
                font-family: "DMSans-Regular";
                font-size: 14px;
                background:$semiGradientLight;
                border:none;
                position: absolute;
                border-radius: 20px;
                padding-left: 20px;
                cursor: pointer;
                &:focus{
                  outline: none!important;
                }
              }
              .dropdown-menu {
                position: absolute;
                background-color: $extraLightBlue;
                width: 65%;
                z-index: 1;
                max-height: 250px;
                overflow: scroll;
                top:32px;
                padding-left:20px;
                border-radius: 20px;
                padding-bottom: 4px;
                padding-top: 4px;
              }
              .dropdown-menu-item {
                padding-top: 8px;
                cursor: pointer;
              }
              .dropdown-menu-item:hover {
                background-color: $lightBlue;
              }
            }
            .switch_controls_box{
              display: flex;
              .switch_container{
                width: 60px;
                height: 20px;
                border-radius: 20px;
                background-color: $lightBlue;
                margin-right: 10px;
                margin-bottom: 5px;
                display: flex;
                justify-content: center;
                align-items:center;
              }
              .switch{
                width: 25px;
                height: 16px;
                border-radius: 20px;
                background-color: $deepBlue;
                position: relative;
                cursor: pointer;
                svg{
                  fill:white;
                  width: 11px;
                  position: absolute;
                  left:50%;
                  top:50%;
                  transform:translate(-50%,-50%);
                }
                &.inactive{
                  background-color: transparent;
                  svg{
                    fill:$deepBlue;
                  }
                }
              }
              .switch_label{
                font-family: "DMSans-Regular";
                font-size: 14px;
              }
            }
            .toggle_controls_wrapper{
              display: flex;
              .toggle_controls_label{
                font-family: "DMSans-Regular";
                font-size: 14px;
                cursor: pointer;
                &.active{
                  color:$deepBlue;
                  pointer-events: none;
                }
                &:hover{
                  color:$deepBlue;
                }
              }
              .toggle_controls_box{
                width: 50px;
                height: 20px;
                background-color: $lightBlue;
                border-radius: 20px;
                margin-left:5px;
                margin-right:5px;
                position: relative;
                cursor: pointer;
                &:hover{
                  .toggle_controls_inner{
                    background-color: $mediumBlue;
                  }
                }
                .toggle_controls_inner{
                  width: 25px;
                  height: 15px;
                  background-color: $deepBlue;
                  border-radius: 15px;
                  position: absolute;
                  top:50%;
                  transform: translate(0,-50%);
                  left:2px;
                  right:auto;
                  transition:all 0.3s ease-in-out;
                }
                &.toggled{
                  .toggle_controls_inner{
                    left:auto;
                    right: 2px;
                  }
                }
              }
            }
            .controls_multiple_tick_container{
              display: flex;
              flex-wrap: wrap;
              .controls_tick_container{
                flex: 1 0 26%;
                margin: 0px;
                &:last-child{
                  flex: 1 0 59%;
                }
              }
              &.sequential{
                .controls_tick_container{
                  &:nth-last-child(-n+3){
                    .tick{
                      &:after{
                        display: none;
                      }
                    }
                  }
                  .tick{
                    position: relative;

                    &:after{
                      content: "";
                      width: 2px;
                      height: 10px;
                      background-color: $lightBlue;
                      position: absolute;
                      bottom:-11px;
                      left:50%;
                      transform:translate(-50%,0);  
                    }

                  }
                }
              }
            }
            &.boxed{
              .controls_box_header{
                width: 100%;
                height: 36px;
                background: $semiGradientDark;
                border-radius: 36px;
                margin:0 auto;
                text-align: center;
                position: relative;
                svg{
                  position: absolute;
                  fill: white;
                  width: 20px;
                  left: 15px;
                  top:50%;
                  transform:translate(0,-50%);
                }
                .controls_box_header_title{
                  position: relative;
                  color:white;
                  font-family: "barlow-semibold";
                  font-size: 17px;
                  top:4px;
                  span{
                    font-size: 12px;
                  }
                }
              }
              &.boxed.disable{
                pointer-events: none;
                opacity: 0.4;
              }

              .controls_box_body{
                width: 90%;
                background-color: $extraLightBlue;
                margin:0 auto;
                padding-top:15px;
                padding-left: 15px;
                padding-bottom: 15px;
                display:grid;
                grid-template-columns: auto auto;
                grid-column-gap: 0px;
                grid-row-gap: 0px;
                &.sectors_box{
                  display: block;
                  .controls_tick_container{
                    margin-bottom: 15px;
                    &:last-child{
                      margin-bottom: 0px;
                    }
                    .tick_label{
                      text-wrap: wrap;
                      position: absolute;
                      width: 80%;
                      margin-left:30px;
                    }
                  }
                }
                .controls_tick_container{
                  width: 100%;
                  .tick_label{
                    text-wrap: nowrap;
                  }
                }
              }
            }
          }
          .controls_filet{
            width:80%;
            height: 1px;
            background-color: $extraLightBlue;
            margin-bottom: 20px;
          }
          .controls_radio_container{
            display: flex;
            cursor: default;
            .radio{
              width: 20px;
              height: 20px;
              border-radius: 100%;
              background-color: $lightBlue;
              margin-right: 10px;
              margin-bottom: 5px;
              border:1px solid $deepBlue;
              box-sizing: border-box;
              position: relative;
              cursor: normal;
              .radio_inner{
                width: 11px;
                height: 11px;
                border-radius: 100%;
                background-color: $deepBlue;
                position: absolute;
                left:50%;
                top:50%;
                transform:translate(-50%,-50%);
              }
            }
            .radio_label{
              font-family: "DMSans-SemiBold";
              font-size: 14px;
              color:$deepBlue;
            }
            &.inactive{
              cursor: pointer;
              &:hover{
                .radio_label{
                  color:$deepBlue;
                }
                .radio{
                  .radio_inner{
                    display: block;
                    opacity: 0.3;
                  }
                }
              }
              .radio{
                .radio_inner{
                  display: none;
                }
              }
              .radio_label{
                font-family: "DMSans-Regular";
                color:black;
              }
            }
          }
          .controls_tick_container{
            display: flex;
            cursor: pointer;
            &.disable{
              pointer-events: none;
              opacity: 0.4;
            }
            &.non-selectable{
              pointer-events: none;
              .tick{
                background-color: #fff;
                .tick_inner{
                  &:before{
                    background-color: $deepBlue;
                  }
                  &:after{
                    background-color: $deepBlue;
                  }
                }
              }
            }
            &.controls_tick_container_yellow{
              .tick{
                background-color: $yellow;
                border:1px solid $yellow;
              }
              &.inactive{
                &:hover{
                  .tick{
                    background-color: rgba(249,174,21,0.3);
                  }
                  .tick_label{
                    color:$yellow;
                  }
                }
              }
            }
            .tick{
              width: 20px;
              height: 20px;
              border-radius: 5px;
              background-color: $deepBlue;
              margin-right: 10px;
              margin-bottom: 10px;
              border:1px solid $deepBlue;
              box-sizing: border-box;
              position: relative;
              .tick_inner{
                width: 100%;
                height: 100%;
                position: absolute;
                &:before{
                  content: "";
                  width: 2px;
                  height: 12px;
                  background-color: white;
                  position: absolute;
                  left:50%;
                  top:50%;
                  transform:translate(-50%,-50%) rotate(45deg);
                }
                &:after{
                  content: "";
                  width: 2px;
                  height: 12px;
                  background-color: white;
                  position: absolute;
                  left:50%;
                  top:50%;
                  transform:translate(-50%,-50%) rotate(-45deg);
                }
              }
            }
            .tick_label{
              font-family: "DMSans-Regular";
              font-size: 14px;
              color:black;
            }
            &.inactive{
              cursor: pointer;
              &:hover{
                .tick{
                  background-color: $lightBlue;
                }
                .tick_label{
                  color:$deepBlue;
                }
              }
              .tick{
                background-color: white;
                .tick_inner{
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 728px) {

    .chartComponent{
      .componentSpace{
        .chartSpace{
          width: 100%;
          display: block;
          
          }
        .controlsSpace{
          width: 100%;
          display: block;
        }
      }
    }
    
  }
}
</style>
