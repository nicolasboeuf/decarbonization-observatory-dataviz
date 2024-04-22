import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    myData:{},
    endImport:0
  },
  mutations: {
    initializeData (state,data) {
      state.myData[data.param] = []
      state.myData[data.param] = data.data
    },
    endImport(state,value){
      state.endImport = state.endImport+value
    }
  }
})
