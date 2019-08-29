import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import getters from './getters'
import basic from './modules/basicConfig';

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    basic,
    errorLog,
  },
  getters
})

export default store
