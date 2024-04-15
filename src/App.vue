<template>
  <div id="app">
    <h1>Observatory of the global and national decarbonization</h1>
    <CurrentEmissionsChart></CurrentEmissionsChart>
  </div>
</template>

<script>

import CurrentEmissionsChart from './components/CurrentEmissionsChart.vue'
import store from '@/store'
import { getData } from './import.js'

export default {
  name: 'App',
  components: {
    CurrentEmissionsChart
  },

  computed: {
    dataImport() {
      return store.state.endImport
    },
    myData(){
      return store.state.myData
    }
  },

  watch:{
    dataImport:function(){
      
    }
  },
  
  created(){
    getData(store)
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
    position: relative;
    .componentSpace{
      position: relative;
      .chartSpace{
        position: relative;
        width: 70%;
        height: 700px;
        display: inline-block;
        }
      .controlsSpace{
        position: relative;
        width: 30%;
        min-height: 700px;
        display: inline-block;
        border:1px solid black;
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
            .controls_dropdown{
              width: 65%;
              height: 28px;
              border-radius: 20px;
              background:$semiGradientLight;
              padding-left: 20px;
              padding-top: 7px;
              position: relative;
              cursor: pointer;
              font-family: "DMSans-Regular";
              font-size: 14px;
              &:after{
                content:"";
                position: absolute;
                right:20px;
                top: 50%;
                transform:translate(0,-5px);
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 10px solid black;
                clear: both;
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
                .controls_radio_container{
                  width: 100%;
                  .radio{
                    border:none;
                    .radio_inner{

                    }
                  }
                  .radio_label{
                    text-wrap: nowrap;
                  }
                }
              }
            }
          }
          .controls_radio_container{
            display: flex;
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
              .radio{
                cursor: pointer;
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
