<template>
    <div>
        <Modal v-if="showModal" @close="closeModal">

            <!--
                you can use custom content here to overwrite
                default content
            -->
            <h3 slot="header">{{customStrategy.title}}</h3>
            <textarea slot="body" placeholder="add description" class="form-control" v-model="customStrategy.description"></textarea>

        </Modal>
        <transition name="fade">
            <fieldset>
                <div class="form-top">
                    <div class="form-top-left">
                        <p>Assign Practice Strategies:</p>
                    </div>
                    <div class="form-top-right">
                    </div>
                </div>
                <div class="form-bottom">
                    <div v-for="(piece,index) in selectedPieces" :key="index" class="form-group">
                        <div class="card">
                            <div class="card-header">
                                {{ piece.name + ' - ' + piece.source }}
                            </div>
                            <div class="card-body">
                                <div v-if="!piece.measures.length">
                                    <div class="row">
                                        <div class="col">
                                            <div class="input-group">
                                                <v-select taggable push-tags class="strategy-select" v-model="selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id]" :options="strategies" >
                                                    <template slot="option" slot-scope="option">
                                                        {{ option.label || handleNewEntry(option)}} <span v-if="!option.label" class="text-muted small"> - User Entry</span>
                                                    </template>
                                                </v-select>
                                                <div class="input-group-append">
                                                    <button v-bind:class="{ 'btn-outline-success': selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id] }" class="btn btn-outline-secondary" type="button" v-on:click="addStrategy(piece.strategies,(piece.source === 'User Entry' ? 'U':'') + piece.id)">Add Strategy</button>
                                                </div>
                                            </div>
                                            <br />
                                            <p v-if="selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id]">{{selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id].description}}</p>    
                                            <br />
                                            <p v-if="!piece.strategies.length">No strategies added</p>
                                            <p v-if="piece.strategies.length">Selected Strategies</p>
                                            <ol>
                                                <li v-for="(strategy,index) in piece.strategies" :key="index">
                                                    {{ strategy.label }}
                                                </li>
                                            </ol>                                             
                                            <br />
                                            <br />
                                        </div>
                                    </div>
                                </div>
                                <h5 class="card-title">Measures</h5>
                                <p v-if="!piece.measures.length">No measures added</p>
                                <div v-for="(measure,index) in piece.measures" :key="index">
                                    <div class="row">
                                        <div class="col">
                                            <p class="card-text">{{measure.measure}} - Tempo {{measure.tempo}}</p>
                                            <div class="input-group">
                                                <v-select taggable push-tags class="strategy-select" v-model="selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id+''+measure.id]" :options="strategies" >
                                                    <template slot="option" slot-scope="option">
                                                        {{ option.label || handleNewEntry(option)}} <span v-if="!option.label" class="text-muted small"> - User Entry</span>
                                                    </template>
                                                </v-select>
                                                <div class="input-group-append">
                                                    <button v-bind:class="{ 'btn-outline-success': selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id+''+measure.id] }" class="btn btn-outline-secondary" type="button" v-on:click="addStrategy(measure.strategies,(piece.source === 'User Entry' ? 'U':'')+piece.id+''+measure.id)">Add Strategy</button>
                                                </div>
                                            </div>
                                            <br />
                                            <p v-if="selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id+''+measure.id]">{{selectedStrategy[(piece.source === 'User Entry' ? 'U':'')+piece.id+''+measure.id].description}}</p>    
                                            <br />
                                            <p v-if="!measure.strategies.length">No strategies added for measure</p>
                                            <p v-if="measure.strategies.length">Selected Strategies</p>
                                            <ol>
                                                <li v-for="(strategy,index) in measure.strategies" :key="index">
                                                    {{ strategy.label }}
                                                </li>
                                            </ol>  
                                            <br />
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn go btn-previous" v-on:click="go(2)">Previous</button>
                    <button type="button" class="btn go btn-next" v-on:click="go(4)">Next</button>
                </div>
            </fieldset>
        </transition>
    </div>
</template>

<script>

    import Modal from './Modal.vue';

    export default {
    name: 'Step3',
    components: {
        Modal
    },
    beforeMount: function(){

    },
    props: {
        selectedPieces: Array,
        strategies:Array
    },
    data: function(){
        return {
            showModal: false,
            selectedStrategy:{},
            customStrategy : {
                title:'',
                id:'',
                description:'',
                strategiesRef:[]
            }
        }
    },
    methods: {
        go: function(ind){
            this.$parent.go(ind);
        },
        addStrategy: function(strategies,id){

            console.log(this.selectedStrategy[id]);

            if(this.selectedStrategy[id]){

                if(!this.selectedStrategy[id].id){
                    this.customStrategy.id = id;
                    this.customStrategy.title = this.selectedStrategy[id].label;
                    this.customStrategy.strategiesRef = strategies;
                    this.showModal = true;
                }
                else {
                    strategies.push(this.selectedStrategy[id]);
                    delete this.selectedStrategy[id];
                }
            }
        },
        handleNewEntry: function(option){
            return Object.keys(option).reduce((name,key)=>{
                name += option[key];
                return name;
            },"");
        },
        closeModal: function(){
            if(this.customStrategy.description){
                this.customStrategy.strategiesRef.push({
                    label:this.customStrategy.title,
                    id:this.customStrategy.id,
                    description:this.customStrategy.description,
                    custom:true
                });
                delete this.selectedStrategy[this.customStrategy.id];
                delete this.customStrategy.strategiesRef;
                this.customStrategy.description = '';
            }
            this.showModal = false;
        }
    }
}
</script>