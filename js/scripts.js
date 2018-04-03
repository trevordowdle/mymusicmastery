Vue.component('v-select', VueSelect.VueSelect);

var strategy_app = new Vue({
    el: '#strategy-app',
    beforeMount(){
        let vueThis = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(xhttp.responseText);
                data.values.shift();
                vueThis.pieces = data.values.sort().reduce((prev,row)=>{
                    prev.map[row[0]] = row[1];
                    prev.rows.push(row[0]);
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
        xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values/Piece!A:B?&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        xhttp.send();
    
    },
    data: {
        pieces:{
            map:{},
            rows:[]
        },
        selectedPiece:'',
        step1:true,
        step2:false,
        step:1,
        go: function(goTo){
            this['step'+this.step] = false;
            setTimeout(()=>{
                this.step = goTo;
                this['step'+goTo] = true;   
            },500); 
        }
    }
})