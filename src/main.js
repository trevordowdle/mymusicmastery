import Vue from 'vue'
import App from './MyMusicMastery.vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#mymusicmastery')
