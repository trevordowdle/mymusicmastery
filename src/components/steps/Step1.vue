<template>
    <div>
        <transition name="fade">
            <fieldset v-if="step1_a">
                <div class="form-top">
                    <div class="form-top-left">
                        <p>Select Piece(s):</p>
                    </div>
                    <div class="form-top-right">
                    </div>
                </div>
                <div class="form-bottom">
                    <v-select class="pieces-select" multiple taggable push-tags v-model="selectedPieces" :options="pieces.rows" @input="checkInput" >
                        <template slot="option" slot-scope="option">
                            {{ option.name || handleNewEntry(option)}} <span class="text-muted small"> - {{ option.source || 'User Entry' }}</span>
                        </template>
                    </v-select>
                    <br />
                    <p v-if="selectedPieces.length">Selected Pieces</p>
                    <ol>
                        <li v-for="(piece,i) in selectedPieces" :key="i">
                            {{ piece.name }} <span class="text-muted small"> - {{ piece.source }}</span>
                        </li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <button type="button" v-bind:class="{disabled:!selectedPieces.length}" :disabled="!selectedPieces.length" class="go btn btn-next" v-on:click="go('1_b')">Next</button>
                </div>
            </fieldset>
        </transition>
        <transition name="fade">
            <fieldset v-if="step1_b">
                <div class="form-top">
                    <div class="form-top-left">
                        <p>Set Tempo(s):</p>
                    </div>
                    <div class="form-top-right">
                    </div>
                </div>
                <div class="form-bottom">
                    <div v-for="(piece,i) in selectedPieces" :key="i" class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">
                                    {{ piece.name+' ' }} <span class="text-muted small"> - {{ piece.source }}</span>
                                </span>
                            </div>
                            <input type="text" v-model="piece.tempo" class="form-control" placeholder="Enter Tempo">
                        </div>
                        <span>{{piece.temp}}</span>
                    </div>
                    <br />
                    <br />
                    <button type="button" class="btn go btn-previous" v-on:click="go('1_a')">Previous</button>
                    <button type="button" class="btn go btn-next" v-on:click="go(2)">Next</button>
                </div>
            </fieldset>
        </transition>
    </div>
</template>

<script>
    export default {
    name: 'Step1',
    beforeMount: function(){

    },
    props: {
        pieces: Object,
        selectedPieces: Array
    },
    data: function(){
        return {
            step1_a:true,
            step1_b:false,
            userEntries:0
        }
    },
    methods: {
        handleNewEntry(option){
            return this.$parent.handleNewEntry(option);
        },
        checkInput: function(val){
            if(val.length && !val[val.length-1].name){
                this.userEntries += 1;
                this.$set(val, val.length-1, {
                    label:val[val.length-1].label,
                    name:val[val.length-1].label,
                    source:'User Entry',
                    tempo:'',
                    measures:[],
                    strategies:[],
                    id:this.userEntries
                });
            }
        },
        go: function(ind){
            if(ind==='1_b'){
                this['step1_a'] = false;
                setTimeout(()=>{
                    this['step1_b'] = true;   
                },500); 
            }
            else if(ind==='1_a'){
                this['step1_b'] = false;
                setTimeout(()=>{
                    this['step1_a'] = true;   
                },500);     
            }
            else {
                this.$parent.go(ind);
            }

        }
    }
}
</script>