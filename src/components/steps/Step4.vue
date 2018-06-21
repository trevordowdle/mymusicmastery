<template>
    <div>
        <Modal v-if="showModal" @close="closeModal">

            <!--
                you can use custom content here to overwrite
                default content
            -->
            <h3 slot="header">Entry Name</h3>
            <input type="text" slot="body" placeholder="specify entry name" class="form-control" v-model="selectedPieces.entryName" />

        </Modal>
        <transition name="fade">
            <fieldset>
                <div class="form-top">
                    <div class="form-top-left">
                        <p>Add Notes:</p>
                    </div>
                    <div class="form-top-right">
                    </div>
                </div>
                <div class="form-bottom">  
                    <div v-for="(piece,i) in selectedPieces" :key="i" class="form-group">
                        <h5>{{ piece.name }} <span class="text-muted small"> - {{ piece.source }}</span></h5>
                        <textarea class="form-control" v-model="piece.notes" placeholder="Notes">
                        </textarea>
                        <br />
                        <input type="text" class="form-control" v-model="piece.link" placeholder="Video Link" /> 
                        <br />
                    </div>
                    <button type="button" class="btn go btn-previous" v-on:click="go(3)">Previous</button>
                    <button v-if="!entryUID" type="button" class="btn go btn-previous" v-on:click="saveEntry()">Save Entry</button>
                    <button v-if="entryUID" type="button" class="btn go btn-previous" v-on:click="saveEntry(true)">Update Entry</button>
                    <button v-if="entryUID" type="button" class="btn go btn-previous" v-on:click="pdf()">Generate CheckList</button>
                </div> 
            </fieldset> 
        </transition>
    </div>
</template>

<script>

    import { generatePDF, breakUptext } from '../../pdf.js';
    console.log(generatePDF);

    import Modal from './Modal.vue';

    export default {
    name: 'Step4',
    components: {
        Modal
    },
    beforeMount: function(){
    },
    props: {
        selectedPieces: Array,
        entryUID:String,
        database:Object,
        userUID:String
    },
    data: function(){
        return {
            showModal: false
        }
    },
    methods: {
        go: function(ind){
            this.$parent.go(ind);
        },
        saveEntry: function(){
            this.showModal = true;
        },
        pdf: function(){
            var doc = generatePDF(this.selectedPieces);

            let strategyList = this.extractUniqueStrategies();

            this.writeStrategies(doc,strategyList);

            doc.save('checkList.pdf');
        },
        writeStrategies: function(doc,strategyList){
            doc.addPage();
            doc.text('Strategy Descriptions:', 20, 20);
            let trackHeight = 0,
                measureIndex = 0;

            strategyList.map((strategy,index)=>{
                doc.text(strategy.label+':', 20,40+(measureIndex*20)+trackHeight);
                strategy.description = strategy.description.replace(/\n/g,' ');
                strategy.description = strategy.description.replace(/\r/g,'');
                breakUptext(125,strategy.description).map((desc)=>{
                    if(!desc.trim()){
                        desc = 'Not Available';
                    }
                    trackHeight += 20;
                    doc.text(desc+' ', 20,40+(measureIndex*20)+trackHeight);
                });
                if(trackHeight+(20*measureIndex) >= 720){
                    removeIndex = measureIndex+1;
                    doc.addPage();
                    trackHeight = 0;
                    measureIndex = measureIndex - removeIndex;
                }
                measureIndex += 1;
            });

        },
        extractUniqueStrategies: function(){

            var uniqueStrategies = {},
                strategies = [];

            this.selectedPieces.map(piece => {

                if(!piece.strategies){
                    piece.strategies = [];
                }
                
                piece.strategies.map((strategy)=>{
                    if(!uniqueStrategies[strategy.id]){
                        uniqueStrategies[strategy.id] = true;
                        strategies.push({
                            id:strategy.id,
                            label:strategy.label,
                            description:strategy.description
                        });
                    }
                });

                if(!piece.measures){
                    piece.measures = [];
                }

                piece.measures.map(measure=>{
                    measure.strategies.map((strategy)=>{
                        if(!uniqueStrategies[strategy.id]){
                            uniqueStrategies[strategy.id] = true;
                            strategies.push({
                                id:strategy.id,
                                label:strategy.label,
                                description:strategy.description
                            });
                        }
                    });
                });

            });

            return strategies;

        },
        closeModal: function(){

            if(!this.selectedPieces.entryName.trim()){
                this.selectedPieces.entryName = this.selectedPieces.entryName.trim();
                return false;
            }

            if(this.entryUID){
                this.database.ref('users/' + this.userUID + '/entries/' + this.entryUID).set(
                    this.selectedPieces
                ).then(()=>{
                    this.$parent.exitEntry();
                },(err)=>{
                    console.log(err);
                    alert('err saving, please contact support.');  
                });
            }
            else {
                let newEntryRef = this.database.ref('users/' + this.userUID + '/entries').push();
                newEntryRef.set(this.selectedPieces).then(()=>{
                    this.$parent.exitEntry();
                    //alert('success');
                },(err)=>{
                    console.log(err);
                    alert('err saving, please contact support.');  
                });
            }
        }
    }
}
</script>