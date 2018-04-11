Vue.component('v-select', VueSelect.VueSelect);

var strategy_app = new Vue({
    el: '#strategy-app',
    beforeMount(){
        let vueThis = this;
        let pieces, sources;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(xhttp.responseText);

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
                    prev.map[row[0]] = {
                                            pieceID:row[1],
                                            sourceID:row[2]
                                       };
                    prev.rows.push({name:row[0],label:row[0]+' '+row[1],source:vueThis.sourceMap[row[2]],tempo:'',measures:[]});
                    return prev;
                },vueThis.pieces);
            }
        };
        xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A:C&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        //values:batchGet?ranges=Source!A:B&ranges=Source!A:B
        ///values/Piece!A:B,Source!A:B?key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA
        xhttp.send();
    
    },
    data: {
        pieces:{
            map:{},
            rows:[]
        },
        sourceMap:{

        },
        selectedPieces:[],
        step1:true,
        step1_b:false,
        step2:false,
        step:1,
        handleNewEntry: function(option){
            return Object.keys(option).reduce((name,key)=>{
                name += option[key];
                return name;
            },"");
        },
        checkInput: function(val){
            if(val.length && !val[val.length-1].name){
                Vue.set(val, val.length-1, {
                    label:val[val.length-1].label,
                    name:val[val.length-1].label,
                    source:'User Entry',
                    tempo:'',
                    measures:[]
                });
            }
        },
        addMeasure: function(measures,ev){
            var tempoInput = ev.target.parentElement.previousElementSibling,
                measureInput = tempoInput.previousElementSibling;

            if(measureInput.value.trim() && tempoInput.value.trim()){
                measures.push({measure:measureInput.value,tempo:tempoInput.value});
                measureInput.value = "";
                tempoInput.value = "";
            }

        },
        go: function(goTo){
            //debugger;
            //console.log(this.sourceMap);
            //console.log(this.selectedPieces);
            this['step'+this.step] = false;
            setTimeout(()=>{
                this.step = goTo;
                this['step'+goTo] = true;   
            },500); 
        }
    }
})