import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config:{},
    configEndImport:0,
    currentEmissionsData:{},
    currentEmissionsDataEndImport:0,
    globalTempData:{},
    globalTempDataEndImport:0,
    impactScenariosData:{},
    impactScenariosDataEndImport:0,
    combinedImpactData:{},
    combinedImpactDataEndImport:0
  },
  mutations: {
    initializeConfig (state,data) {
      state.config = data.data
    },
    configEndImport(state){
      state.configEndImport = 1
    },
    initializeCurrentEmissionsData (state,data) {
      state.currentEmissionsData[data.param] = []
      state.currentEmissionsData[data.param] = data.data
    },
    currentEmissionsDataEndImport(state,value){
      state.currentEmissionsDataEndImport = state.currentEmissionsDataEndImport+value
    },
    initializeglobalTempData(state,data){
      state.globalTempData = data
    },
    globalTempDataEndImport(state,value){
      state.globalTempDataEndImport = state.globalTempDataEndImport+value
    },
    initializeImpactScenariosData (state,data) {
      state.impactScenariosData[data.param] = []
      state.impactScenariosData[data.param] = data.data
    },
    impactScenariosDataEndImport(state,value){
      state.impactScenariosDataEndImport = state.impactScenariosDataEndImport+value
    },
    initializeCombinedImpactData (state,data) {
      state.combinedImpactData[data.param] = []
      state.combinedImpactData[data.param] = data.data
    },
    combinedImpactDataEndImport(state,value){
      state.combinedImpactDataEndImport = state.combinedImpactDataEndImport+value
    }
  }
})