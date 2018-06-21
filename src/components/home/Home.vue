<template>
    <div class="home">
        <br />
        <br />
        <div class="card">
            <div class="card-header">
                Entries
            </div>
            <div class="card-body">
                <div v-for="(entry,i) in entries" :key="i">
                    <a v-on:click="goToEntry(i,$event)" href="">{{entry.entryName}}</a>
                </div>
            </div>
        </div>
        <br />
        <br />
    </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
      entries:Object
  },
  beforeMount: function(){
  },
  methods:{
      goToEntry(entryRef,ev){
            ev.preventDefault();
            this.$emit('update',{ref:'existingEntry',val:this.entries[entryRef]});
            this.$emit('update',{ref:'entryUID',val:entryRef});
            this.$emit('update',{ref:'home',val:false});
            this.$emit('update',{ref:'newEntry',val:true});
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
