import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import '@babel/polyfill'
import 'vue-material-design-icons/styles.css';
import * as fb from 'firebase'


Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    created() {
        fb.initializeApp({
            apiKey: "AIzaSyARE5EaIhBX7VGff7OCllOAPgMqCV6C7mY",
            authDomain: "ads-project-eb1b1.firebaseapp.com",
            databaseURL: "https://ads-project-eb1b1.firebaseio.com",
            projectId: "ads-project-eb1b1",
            storageBucket: "ads-project-eb1b1.appspot.com",
            messagingSenderId: "584415028103",
            appId: "1:584415028103:web:91b86fa7e9a8480b48a922",
            measurementId: "G-R725K7PSRQ"
        })

        fb.auth().onAuthStateChanged(user => {
            if (user){
                this.$store.dispatch('autoLoginUser')
            }
        })
    },
    render: h => h(App)
}).$mount('#app');


