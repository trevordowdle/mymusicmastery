<template>
    <div class="profile">
        <br />
        <br />
        <div class="row">
            <div class="col-md-8 offset-md-2 col-sm-7 offset-sm-3 form-box">
                <p>Profile</p>
            </div>
            <div class="col-md-8 offset-md-2 col-sm-7 offset-sm-3">
                <div class="card">
                    <div class="card-header">
                        <p v-if="user.name">{{user.name}}</p>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="form-group">
                                <label for="formInstrument">Instrument</label>
                                <input v-model="user.instrument" type="text" class="form-control" id="formInstrument" placeholder="Specify Instrument">
                            </div>
                            <div class="form-group">
                                <label for="formAgeRange">Age Range</label>
                                <select v-model="user.ageRange" class="form-control" id="formAgeRange">
                                    <option value="">Select Age Range</option>
                                    <option value="U8">Under 8</option>
                                    <option value="8to11">8-11</option>
                                    <option value="12to17">12-17</option>
                                    <option value="18to24">18-24</option>
                                    <option value="25to37">25-37</option>
                                    <option value="38+">38+</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="formSkillLevel">Skill Level</label>
                                <select v-model="user.skillLevel" class="form-control" id="formSkillLevel">
                                    <option value="">Select Skill Level</option>
                                    <option>Beginner</option>
                                    <option>Competent</option>
                                    <option>Proficient</option>
                                    <option>Expert</option>
                                </select>
                            </div>
                            <transition name="fade">
                                <div v-show="updatedSuccess" class="alert alert-success" role="alert">
                                    Update Successful
                                </div>
                            </transition>
                            <button v-on:click="update()" class="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <br />
        <br />
    </div>
</template>

<script>

export default {
  name: 'Profile',
  props: {
      user:Object,
      database:Object
  },
  components: {
  },
  beforeMount(){
  },
  created: function(){
  },
  data: function(){
    return {
        instrument:'',
        ageRange:'',
        skillLevel:'',
        updatedSuccess:false
    }
  },
  methods: {
      update() {
        
        this.database.ref('users/' + this.user.uid).update({
            instrument: this.user.instrument,
            ageRange: this.user.ageRange,
            skillLevel : this.user.skillLevel
        }).then(()=>{
            this.updatedSuccess = true;
            setTimeout(()=>{
                this.updatedSuccess = false;
            },1000);
        });
      }
  }
}

</script>

<style scoped>

</style>