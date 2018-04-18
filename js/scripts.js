Vue.component('v-select', VueSelect.VueSelect);

var strategy_app = new Vue({
    el: '#strategy-app',
    beforeMount(){

/*         var doc = new jsPDF();

        generateHeader(doc);
        generatePieceHeader(doc);
        doc.save('a4.pdf'); */


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
                    prev.map[row[1]] = {
                                            sourceID:row[2]
                                       };
                    prev.rows.push({name:row[0],label:row[0]+' '+row[1],source:vueThis.sourceMap[row[2]],tempo:'',measures:[],strategies:[],id:row[1]});
                    return prev;
                },vueThis.pieces);
            }

/*         vueThis.selectedPieces = [{"name":"Allegro","label":"Allegro 78","source":"Suzuki Book 7","tempo":"100","measures":[],"strategies":[],"id":"78"},{"name":"Caprice No. 10, Allegretto","label":"Caprice No. 10, Allegretto 3187","source":"Rode 24 Caprices for Violin","tempo":"200","measures":[{"measure":"40","tempo":"55","strategies":[],"id":0},{"measure":"60","tempo":"60","strategies":[],"id":1}],"strategies":[],"id":"3187"},{"name":"Caprice No. 15, Presto","label":"Caprice No. 15, Presto 3216","source":"Paganini 24 Capries for Violin","tempo":"300","measures":[{"measure":"34","tempo":"80","strategies":[],"id":0},{"measure":"68","tempo":"90","strategies":[],"id":1},{"measure":"80","tempo":"65","strategies":[],"id":2}],"strategies":[],"id":"3216"}];
            vueThis.step1 = false;
            vueThis.step3 = true;
            vueThis.step = 3; */
        };

        //xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A1:C10&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        
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
        strategies:[],
        selectedStrategy:{},
        selectedStrategyMethod:{},
        sourceMap:{

        },
        selectedPieces:[],
        step1:true,
        step1_b:false,
        step2:false,
        step3:false,
        step3first:false,
        step4:false,
        step:1,
        userEntries:0,
        handleNewEntry: function(option){
            return Object.keys(option).reduce((name,key)=>{
                name += option[key];
                return name;
            },"");
        },
        checkInput: function(val){
            if(val.length && !val[val.length-1].name){
                this.userEntries += 1;
                Vue.set(val, val.length-1, {
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
        addMeasure: function(measures,ev){
            var tempoInput = ev.target.parentElement.previousElementSibling,
                measureInput = tempoInput.previousElementSibling;

            if(measureInput.value.trim() && tempoInput.value.trim()){
                measures.push({measure:measureInput.value,tempo:tempoInput.value,strategies:[],id:measures.length});
                measureInput.value = "";
                tempoInput.value = "";
            }
        },
        addStrategy: function(strategies,id){

            console.log(this.selectedStrategy[id]);
            //debugger;

            if(this.selectedStrategy[id]){
                strategies.push(this.selectedStrategy[id]);
                delete this.selectedStrategy[id];
            }
        },
        go: function(goTo){
            //debugger;
            //console.log(this.sourceMap);
            //console.log(this.selectedPieces);
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
        loadStrategies: function(){
            let vueThis = this,
                strategies;

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    data = JSON.parse(xhttp.responseText);
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
});


function generateHeader(doc){
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text('FirstName LastName', 5, 10);
    doc.text('Date', 5, 15);

    doc.text('Date', 100, 15);

    doc.setFontSize(22);
    doc.text('Path to Mastery', 100, 10);

}

function generatePieceHeader(doc){

/*     doc.line(20, 20, 60, 20)
    doc.line(100, 20, 100, 60) // vertical line
    doc.rect(20, 20, 10, 10) */

    doc.rect(5, 20, 60, 10); //x,y,width,height
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text('Piece', 6, 26);
    doc.rect(65, 20, 35, 10); //x,y,width,height
    doc.text('Practice Passage', 66, 26);
    doc.rect(100, 20, 40, 10); //x,y,width,height
    doc.text('Practice Strategy', 101, 26);

    doc.rect(140, 20, 60, 10); //x,y,width,height
    doc.line(140, 25, 200, 25);

}