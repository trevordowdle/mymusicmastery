        
<template>
    <div>
        <transition name="modal">
          <div class="my-modal-mask">
            <div class="my-modal-wrapper">
              <div class="my-modal-container">
                <div class="my-modal-header">
                  <slot name="header">
                    default header
                  </slot>
                </div>
                <div class="my-modal-body">
                  <slot name="body">
                    default body
                  </slot>
                </div>
                <div class="my-modal-footer">
                    <button class="my-modal-default-button btn btn-success" @click="$emit('close')">
                      OK
                    </button>
                    <br />
                </div>
              </div>
            </div>
          </div>
        </transition>
    </div>
</template>

<script>
    export default {
    name: 'Modal',
    beforeMount: function(){
    },
    props: {
    },
    data: function(){
        return {}
    },
    methods: {
    }
}
</script>

<style scoped>

    .my-modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    
    .my-modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }
    
    .my-modal-container {
        width: 300px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }
    
    .my-modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }
    
    .my-modal-body {
        margin: 20px 0;
    }
    
    .my-modal-default-button {
        float: right;
    }
    
    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */
    
    .modal-enter {
        opacity: 0;
    }
    
    .modal-leave-active {
        opacity: 0;
    }
    
    .modal-enter .my-modal-container,
    .modal-leave-active .my-modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }


</style>