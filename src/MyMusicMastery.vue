<template>
  <div id="mymusicmastery">
    <Header :login="login" :entryUID="entryUID" :newEntry="newEntry" :profile="profile" :home="home" @update="updateData" />
    <div class="container">
<!--     <img src="./assets/logo.png"> -->
<!--     <HelloWorld msg="Welcome to Your Vue.js App"/> -->
      <Login v-show="login" @update="updateData"/>
      <div v-if="!login">
        <Steps @update="updateData" v-if="newEntry" :entryUID="entryUID"  :database="database" :userUID="user.uid" :existingEntry="existingEntry" />
        <Profile v-if="profile" :user="user" :database="database" />
        <Home @update="updateData" v-if="home" :entries="user.entries" />
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Login from './components/Login.vue';
import Steps from './components/steps/Steps.vue';
import Profile from './components/profile/Profile.vue';
import Header from './components/Header.vue';
import Home from './components/home/Home.vue';

export default {
  name: 'mymusicmastery',
  components: {
    HelloWorld,
    Login,
    Steps,
    Profile,
    Header,
    Home
  },
  created: function(){
  },
  data: function(){
    return {
      login:false,
      profile:false,
      newEntry:false,
      home:true,
      user:{},
      database:null,
      existingEntry:null,
      entryUID:''
    }
  },
  methods: {
    updateData(arg){
      this[arg.ref] = arg.val;
    }
  }
}
</script>

<style>
#mymusicmastery {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color:#4958c7;
}
</style>
