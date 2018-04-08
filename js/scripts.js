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
                    prev.rows.push({name:row[0],label:row[1],source:vueThis.sourceMap[row[2]]});
                    return prev;
                },vueThis.pieces);


/*                 data = data.sheets.reduce((mstr,row)=>{
                    mstr.titles.push(row.properties.title);
                    mstr[row.properties.title] = row.data[0].rowData.map((info)=>{
                        return {
                            Song:info.values[0].formattedValue,
                            Value:info.values[1].formattedValue
                        }
                    });
                    return mstr;
                },{titles:[]});
                data.titles.map((title)=>{
                    var select = "<div class='col'>" +
                                    "<div class='input-group'>"+
                                        "<div class='input-group-prepend'>" +
                                            "<label class='input-group-text' for='"+title.toLowerCase().replace(/ /g, "-")+"'>"+title+"</label>" +
                                        "</div>" +
                                        "<select class='custom-select' onChange='test()' id="+title.toLowerCase().replace(/ /g, "-")+">" +
                                            "<option></option>" +
                                            buildOptions(title) +
                                        "</select>" +
                                    "</div>" +
                                "</div>";
                    document.getElementById('selects').insertAdjacentHTML('beforeend', select);
                });
                doneGo = true; */
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
        step2:false,
        step:1,
        go: function(goTo){
            console.log(this.selectedPiece);
            this['step'+this.step] = false;
            setTimeout(()=>{
                this.step = goTo;
                this['step'+goTo] = true;   
            },500); 
        }
    }
})