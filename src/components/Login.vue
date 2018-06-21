<template>
    <div class="login">
        <br />
        <br />
        <transition name="fade">
            <fieldset>
                <p>Login</p>
                <div id="firebaseui-auth-container"></div>
            </fieldset>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'Login',
  beforeMount: function(){
    let vueThis = this,
        userInfo = {};

    var database = firebase.database();

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        userInfo.phoneNumber = user.phoneNumber;
        userInfo.providerData = user.providerData;
        userInfo.name = user.displayName;
        userInfo.email = user.email;
        userInfo.photoUrl = user.photoURL;
        userInfo.uid = user.uid;


        database.ref('users/' + userInfo.uid).update({
            username: userInfo.name,
            email: userInfo.email,
            profile_picture : userInfo.photoUrl
        });

        database.ref('users/' + userInfo.uid).on("value", snapshot =>{
            let userInf = snapshot.val();
            userInfo.instrument = userInf.instrument || '';
            userInfo.ageRange = userInf.ageRange || '';
            userInfo.skillLevel = userInf.skillLevel || ''; 
            userInfo.entries = userInf.entries;
            vueThis.$emit('update',{ref:'user',val:userInfo});
        }, err =>{
            console.log('read failed');
        });

        vueThis.$emit('update',{ref:'login',val:false});
        vueThis.$emit('update',{ref:'home',val:true});
        vueThis.$emit('update',{ref:'step1',val:true});
        vueThis.$emit('update',{ref:'database',val:database});

        /*             
            user.getIdToken().then(function(accessToken) {
                debugger;
                console.log(accessToken);
            }); 
        */

      } else {
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
        vueThis.$emit('update',{ref:'login',val:true});
      }
      vueThis.$emit('update',{ref:'loaded',val:true});
    }, function(error) {
      console.log(error);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
