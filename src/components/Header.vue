<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#" v-on:click="updateNav(false,false,true)">My Music Mastery</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-bind:class="{ active: home }">
            <a class="nav-link" href="#" v-bind:class="{ disabled: login }" v-on:click="updateNav(false,false,true)">Home</a>
          </li>
          <li class="nav-item" v-bind:class="{ active: newEntry }">
            <a v-bind:class="{ disabled: login }" v-on:click="updateNav(true,false,false)" class="nav-link" href="#">{{entryUID ? 'Existing' : 'New'}} Entry</a>
          </li>
          <li class="nav-item" v-bind:class="{ active: profile }">
            <a v-bind:class="{ disabled: login }" v-on:click="updateNav(false,true,false)" class="nav-link" href="#">Profile</a>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
export default {
  name: 'Header',
  props: {
      login:Boolean,
      newEntry:Boolean,
      profile:Boolean,
      home:Boolean,
      entryUID:String
  },
  beforeMount: function(){
  },
  methods:{
      updateNav(newEntry,profile,home){
        this.$emit('update',{ref:'newEntry',val:newEntry});
        this.$emit('update',{ref:'profile',val:profile});
        this.$emit('update',{ref:'home',val:home});
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
