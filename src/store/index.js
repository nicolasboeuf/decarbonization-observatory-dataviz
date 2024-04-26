import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentEmissionsData:{},
    currentEmissionsDataEndImport:0,
    globalTempData:{},
    globalTempDataEndImport:0
  },
  mutations: {
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
    }
  }
})
