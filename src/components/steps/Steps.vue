<template>
    <div class="steps">
        <div class="row">
            <div class="col-md-8 offset-md-2 col-sm-7 offset-sm-3 form-box">
                <Step1 v-show="step1" :pieces="pieces" :selectedPieces="selectedPieces" />
                <Step2 v-if="step2" :selectedPieces="selectedPieces" />
                <Step3 v-if="step3" :selectedPieces="selectedPieces" :strategies="strategies" />
                <Step4 v-if="step4" :selectedPieces="selectedPieces" :entryUID="entryUID" :database="database" :userUID="userUID" />
            </div>
        </div>
        <br />
        <br />
    </div>
</template>

<script>
import Step1 from './Step1.vue';
import Step2 from './Step2.vue';
import Step3 from './Step3.vue';
import Step4 from './Step4.vue';

export default {
  name: 'Steps',
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  props: {
      entryUID:String,
      database:Object,
      userUID:String,
      existingEntry:Object
  },
  beforeMount(){
        let vueThis = this;

        let pieces, sources;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(xhttp.responseText);

                sources = data.valueRanges[1].values;
                sources.shift();
                vueThis.sourceMap = sources.reduce((prev,row)=>{
                    prev[row[1].toString()] = row[0];
                    return prev;
                },vueThis.sourceMap);

                pieces = data.valueRanges[0].values;
                pieces.shift();
                vueThis.pieces = pieces.sort(function (x, y) {
                    if(x[0] < y[0]) return -1;
                    if(x[0] > y[0]) return 1;
                
                    return x[2] - y[2];
                }).reduce((prev,row)=>{
                    prev.map[row[1]] = {
                                            sourceID:row[2]
                                       };
                    prev.rows.push({name:row[0],label:row[0]+' '+row[1],source:vueThis.sourceMap[row[2]],tempo:'',measures:[],strategies:[],id:row[1],link:'',notes:''});
                    return prev;
                },vueThis.pieces);
            }

        };

        xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A1:C10&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        
        //xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A:C&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        
        //values:batchGet?ranges=Source!A:B&ranges=Source!A:B
        ///values/Piece!A:B,Source!A:B?key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA
        xhttp.send();

        if(vueThis.existingEntry){
            Object.keys(vueThis.existingEntry).map(key=>{
                if(key === "entryName"){
                    this.selectedPieces.entryName = vueThis.existingEntry[key];
                }
                else {
                    this.selectedPieces.push(vueThis.existingEntry[key]);
                }
            });
            vueThis.step1 = false;
            vueThis.step4 = true;
            vueThis.step = 4;
        }
    
    },
  created: function(){
  },
  data: function(){
    return {
      sourceMap:{
      },
      pieces:{
        map:{},
        rows:[]
      },
      step1:true,
      step2:false,
      step3:false,
      step3first:false,
      step4:false,
      login:false,
      step:1,
      selectedPieces:[],
      strategies:[],
    }
  },
  methods: {
    handleNewEntry(option){
        return Object.keys(option).reduce((name,key)=>{
            name += option[key];
            return name;
        },"");
    },
    exitEntry(){
        this.$emit('update',{ref:'newEntry',val:false});
        this.$emit('update',{ref:'entryUID',val:''});
        this.$emit('update',{ref:'existingEntry',val:null});
        this.$emit('update',{ref:'home',val:true});
    },
    go(goTo){
        if(!this.step3first && goTo === 3){
            this.step3First = true;
            this.loadStrategies();
        }

        this['step'+this.step] = false;
        setTimeout(()=>{
            this.step = goTo;
            this['step'+goTo] = true;   
        },500); 
    },
    loadStrategies(){
        let vueThis = this,
            strategies;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(xhttp.responseText);
                strategies = data.valueRanges[0].values;
                strategies.shift();
                vueThis.strategies = strategies.sort(function (x, y) {
                    if(x[0] < y[0]) return -1;
                    if(x[0] > y[0]) return 1;
                
                    return 0;
                }).reduce((prev,row)=>{
                    prev.push({label:row[0],id:row[1],description:row[2] || ''});
                    return prev;
                },vueThis.strategies);
            }
        };            
        xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1SOvyvvAGUuniEf2EXT0jSk4v0cDdq_mxIFRmH1Tvilk/values:batchGet?ranges=PS!A:C&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        xhttp.send();
    }
  }
}
</script>

<style scoped>
    .steps >>> {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        font-weight: 300;
        color: #888;
        line-height: 30px;
        text-align: center;
    }

    .steps >>> .form-box {
        padding-top: 40px;
    }

    .steps >>> .form-top {
        overflow: hidden;
        padding: 0 25px 15px 25px;
        background: #fff;
        -moz-border-radius: 4px 4px 0 0; -webkit-border-radius: 4px 4px 0 0; border-radius: 4px 4px 0 0;
        text-align: left;
    }

    .steps >>> .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .steps >>> .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .steps >>> .form-top-left {
        float: left;
        width: 75%;
        padding-top: 25px;
    }

    .steps >>> .form-top-left h3 { margin-top: 0; }

    .steps >>> .form-top-right {
        float: left;
        width: 25%;
        padding-top: 5px;
        font-size: 66px;
        color: #ddd;
        line-height: 100px;
        text-align: right;
    }

    .steps >>> .form-bottom {
        padding: 25px 25px 30px 25px;
        background: #eee;
        -moz-border-radius: 0 0 4px 4px; -webkit-border-radius: 0 0 4px 4px; border-radius: 0 0 4px 4px;
        text-align: left;
    }

    .steps >>> h3 {
        font-size: 22px;
        font-weight: 300;
        color: #555;
        line-height: 30px;
    }

    .steps >>> .small {
        font-size:.7rem;
    }

    .steps >>> .v-select.pieces-select .selected-tag {
        display:none;
    }

    .steps >>> .v-select.strategy-select {
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        margin-bottom: 0;
    }

    .steps >>> .v-select.strategy-select .dropdown-toggle {
        height:calc(2.25rem + 2px);
        border-top-left-radius:0;
        border-bottom-left-radius:0;
    }

    .steps >>> .white {
        color:white;
    }

    .steps >>> .black {
        color:black;
    }

    .steps >>> button.go {
        height: 50px;
        margin: 0 3px 0 0;
        padding: 0 20px;
        vertical-align: middle;
        background: #19b9e7;
        border: 0;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        font-weight: 300;
        line-height: 50px;
        color: #fff;
        -moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;
        text-shadow: none;
        -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none;
        -o-transition: all .3s; -moz-transition: all .3s; -webkit-transition: all .3s; -ms-transition: all .3s; transition: all .3s;
    }

    .steps >>> fieldset {
        border: none;
    }

    .steps >>> .form-bottom textarea {
        height: 100px;
    }

    .steps >>> .form-bottom button.btn {
        min-width: 105px;
    }

    .steps >>> .form-bottom .input-error {
        border-color: #19b9e7;
    }

    .steps >>> .form-bottom textarea {
        height: 100px;
    }

</style>