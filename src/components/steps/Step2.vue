<template>
    <div>
        <transition name="fade">
            <fieldset>
                <div class="form-top">
                    <div class="form-top-left">
                        <p>Assign Measures:</p>
                    </div>
                    <div class="form-top-right">
                    </div>
                </div>
                <div class="form-bottom">
                    <div v-for="(piece,index) in selectedPieces" :key=index class="form-group">
                        <div class="card">
                            <div class="card-header">
                                {{ piece.name + ' - ' + piece.source }}
                            </div>
                            <div class="card-body">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Enter Measure">
                                    <input type="text" class="form-control" placeholder="Enter Tempo">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" v-on:click="addMeasure(piece.measures,$event)">Add Measure</button>
                                    </div>
                                </div>
                                <h5 class="card-title">Measures</h5>
                                <p v-if="!piece.measures.length">No measures added</p>
                                <p v-for="(measure,index) in piece.measures" :key=index class="card-text">{{measure.measure}} - Tempo {{measure.tempo}}</p>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn go btn-previous" v-on:click="go(1)">Previous</button>
                    <button type="button" class="btn go btn-next" v-on:click="go(3)">Next</button>
                </div>
            </fieldset>
        </transition>
    </div>
</template>

<script>
    export default {
    name: 'Step2',
    beforeMount: function(){

    },
    props: {
        selectedPieces: Array
    },
    data: function(){
        return {
        }
    },
    methods: {
        go: function(ind){
            this.$parent.go(ind);
        },
        addMeasure: function(measures,ev){
            var tempoInput = ev.target.parentElement.previousElementSibling,
                measureInput = tempoInput.previousElementSibling;

            if(measureInput.value.trim() && tempoInput.value.trim()){
                measures.push({measure:measureInput.value,tempo:tempoInput.value,strategies:[],id:measures.length});
                measureInput.value = "";
                tempoInput.value = "";
            }
        }
    }
}
</script>