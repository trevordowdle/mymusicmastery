
var examples = {};

examples.spans = function (data) {

    var doc = new jsPDF('p', 'pt');

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFontStyle('bold');
    //doc.text('Timothy McMurray', 40, 50);

    generatePieceHeader(doc);

    doc.setTextColor(0);

    var columns = [
        {title: "Piece", dataKey: "name"},
        {title: "Measure", dataKey: "measures"}
    ];

    //return doc;

    
    doc.autoTable(columns, data, {
        theme: 'grid',
        startY: 80,
        tableWidth: 575,
        margin: 10,
        styles: {
            lineColor: [0, 0, 0]
        },
        drawHeaderCell: function (cell, data) {
             
            return false;
        },
        drawHeaderRow: function (row, data) { 
            return false;
        },
        drawRow: function (row, data) {
            if(row.index > 0){
                doc.addPage();
                generatePieceHeader(doc);
                data.cursor.y = 80;
            }
            //calculate row height based on data.row.raw.source
            if(data.row.raw.measures.length){
                row.height = 200;
            }
            else {
                row.height = 20 * data.row.raw.strategies.length;
            }

            if(row.height < 80){
                row.height = 80;
            }

            if(60+(data.row.raw.source.length/50)*20 > row.height){
                row.height = 60 + Math.ceil(data.row.raw.source.length/50)*20;
            }

        },
        drawCell: function (cell, data) {
            if(data.column.index === 0){
                cell.width = 184;
                if(data.row.raw.source){
                    cell.text.push('');
                    cell.text.push('Source:');
                    let sourceCollect = '';

                    cell.text = cell.text.concat(breakUptext(40,data.row.raw.source));

                    cell.text.push('');
                }
                if(data.row.raw.tempo){
                    cell.text.push('Assigned tempo: '+data.row.raw.tempo);
                }
            }
            if(data.column.index === 1){
                if(data.row.raw.measures.length){

                    let trackHeight = 0,
                        measureIndex = 0,
                        height,
                        hitNewPage = false;

                    //doc.text(strategy.label, cell.x+87, cell.y+(20*(index))+14);

                    data.row.raw.measures.map((measure,index)=>{
                        height = measure.strategies.length*20;
                        if(height <= 40){
                            height = 60;
                        }

                        let currentMeasure = deliminateText(13,measure.measure);

                        doc.rect(cell.x, cell.y+trackHeight, 85, height); //x,y,width,height
                        doc.text('m. '+currentMeasure, cell.x+4, cell.y+trackHeight+14);
                        doc.text('tempo '+measure.tempo, cell.x+4, cell.y+trackHeight+29);

                        doc.setFontSize(9);

                        let removeIndex = 0; 

                        measure.strategies.map((strategy,indexS)=>{

                            indexS = indexS - removeIndex;

                            let currentStrategy = deliminateText(19,strategy.label);

                            doc.rect(cell.x+85, cell.y+trackHeight+(20*(indexS)), 306, 20); //x,y,width,height
                            doc.text(currentStrategy, cell.x+87, cell.y+trackHeight+(20*(indexS))+14);

                            doc.line(369,cell.y+trackHeight+(20*indexS),369,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*1,cell.y+trackHeight+(20*indexS),369+24*1,cell.y+trackHeight+(20*indexS)+20);  //x,y
                            doc.line(369+24*2,cell.y+trackHeight+(20*indexS),369+24*2,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*3,cell.y+trackHeight+(20*indexS),369+24*3,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*4,cell.y+trackHeight+(20*indexS),369+24*4,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*5,cell.y+trackHeight+(20*indexS),369+24*5,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*6,cell.y+trackHeight+(20*indexS),369+24*6,cell.y+trackHeight+(20*indexS)+20);
                            doc.line(369+24*7,cell.y+trackHeight+(20*indexS),369+24*7,cell.y+trackHeight+(20*indexS)+20);

                            if(trackHeight+(20*indexS) >= 720){
                                removeIndex = indexS+1;
                                doc.addPage();
                                generatePieceHeader(doc);
                                trackHeight = 0;
                                hitNewPage = true;
                                measureIndex = indexS - removeIndex;
                            }
                            else {
                                measureIndex = indexS;
                            }



                        });

                        doc.setFontSize(10);

                        if(data.row.raw.measures.length === index+1){
                            if(data.row.raw.notes){

                                if(!hitNewPage){
                                    measureIndex = index;
                                }

                                let noteBlocks = breakUptext(80,data.row.raw.notes),
                                    hasLink = 0;

                                if(trackHeight+(noteBlocks.length+2)*20 > 630){
                                    trackHeight = 0;
                                    measureIndex = 0;
                                    doc.addPage();
                                    generatePieceHeader(doc);
                                }

                                if(data.row.raw.link){
                                    hasLink = 1;
                                    doc.setTextColor(0,0,255);
                                    doc.text(data.row.raw.link,cell.x+4,cell.y+(20*measureIndex)+38+((noteBlocks.length+1)*12)+trackHeight);
                                    doc.setTextColor(0,0,0);
                                }
                                
                                doc.rect(cell.x, cell.y+(20*(measureIndex))+20+trackHeight, 391, 20+((hasLink+noteBlocks.length)*20));
                                doc.text('Notes / Comments:',cell.x+2,cell.y+(20*measureIndex)+32+trackHeight);
                                noteBlocks.map((block,indexBlock)=>{
                                    doc.text(block,cell.x+4,cell.y+(20*measureIndex)+32+((indexBlock+1)*12)+trackHeight); 
                                });  
                            }
                        }

                        trackHeight += height;                        
                        
                    });
                        
                }
                else {

                    doc.setFontSize(9);


                    data.row.raw.strategies.map((strategy,index)=>{

                        let currentStrategy = deliminateText(19,strategy.label);

                        doc.rect(cell.x+85, cell.y+(20*(index)), 306, 20); //x,y,width,height
                        doc.text(currentStrategy, cell.x+87, cell.y+(20*(index))+14);

                        doc.line(369,cell.y+(20*index),369,cell.y+(20*index)+20);
                        doc.line(369+24*1,cell.y+(20*index),369+24*1,cell.y+(20*index)+20);  //x,y
                        doc.line(369+24*2,cell.y+(20*index),369+24*2,cell.y+(20*index)+20);
                        doc.line(369+24*3,cell.y+(20*index),369+24*3,cell.y+(20*index)+20);
                        doc.line(369+24*4,cell.y+(20*index),369+24*4,cell.y+(20*index)+20);
                        doc.line(369+24*5,cell.y+(20*index),369+24*5,cell.y+(20*index)+20);
                        doc.line(369+24*6,cell.y+(20*index),369+24*6,cell.y+(20*index)+20);
                        doc.line(369+24*7,cell.y+(20*index),369+24*7,cell.y+(20*index)+20);
                    
                        //doc.rect(cell.x, cell.y, 100, cell.height * (index+1), 'S');
                        if(data.row.raw.strategies.length === index+1){

                            doc.setFontSize(10);

                            if(data.row.raw.notes){

                                let noteBlocks = breakUptext(80,data.row.raw.notes),
                                    hasLink = 0;

                                if(data.row.raw.link){
                                    hasLink = 1;
                                    doc.setTextColor(0,0,255);
                                    doc.text(data.row.raw.link,cell.x+4,cell.y+(20*index)+41+((noteBlocks.length+1)*12));
                                    doc.setTextColor(0,0,0);
                                }

                                doc.rect(cell.x, cell.y+(20*(index))+20, 391, 20+((hasLink+noteBlocks.length)*20));
                                doc.text('Notes / Comments:',cell.x+2,cell.y+(20*index)+33);
                                noteBlocks.map((block,indexBlock)=>{
                                    doc.text(block,cell.x+4,cell.y+(20*index)+33+((indexBlock+1)*12)); 
                                });  
                            }
                        }
                    });
                }


                return false;
            }
        }
    });

    // doc.addPage();

    return doc;
}

var deliminateText = function (textLength,source){
    if(source.length > textLength){
        source = source.substring(0,textLength).trim()+'..';
    }
    return source;
}

var breakUptext = function (textLength,source) {
    let sourceCollect = '',
        textBlocks = [];

        source.split(' ').map((word)=>{
        while(word.length > textLength){
            textBlocks.push(sourceCollect + word.substring(0,textLength-sourceCollect.length));
            word = word.substring(textLength-sourceCollect.length);
            sourceCollect = ' ';
        }
        if(sourceCollect.length + word.length <= textLength){
            sourceCollect += word + ' ';
        }
        else {
            textBlocks.push(sourceCollect);
            sourceCollect = word;
        }
    });
    if(sourceCollect){
        textBlocks.push(sourceCollect);
    }
    return textBlocks;
};

Vue.component('v-select', VueSelect.VueSelect);
Vue.component('modal', {
    template: '#modal-template'
});

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
                    prev.map[row[1]] = {
                                            sourceID:row[2]
                                       };
                    prev.rows.push({name:row[0],label:row[0]+' '+row[1],source:vueThis.sourceMap[row[2]],tempo:'',measures:[],strategies:[],id:row[1],link:'',notes:''});
                    return prev;
                },vueThis.pieces);
            }

        };

        //xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A1:C10&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        
        xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1uVMJcnjaxyz8_w6xrR5AFiQ8zMktKuOPEsLL3q7YofM/values:batchGet?ranges=Piece!A:C&ranges=Source!A:B&key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA", true);
        
        //values:batchGet?ranges=Source!A:B&ranges=Source!A:B
        ///values/Piece!A:B,Source!A:B?key=AIzaSyA251gYOA-3nYb0uOHRvdeF5f-zX2PhmpA
        xhttp.send();

        //vueThis.selectedPieces = [{"notes":"yo there","link":"https://www.youtube.com/watch?v=NUfvht7aJPQ","name":"Bourree 2","label":"Bourree 2 39","source":"Suzuki Book 3","tempo":"200","measures":[],"strategies":[{"label":"Clap","id":"19","description":""},{"label":"Record","id":"29","description":""},{"label":"Slow Practice","id":"24","description":""},{"label":"Petersen","id":"39","description":"here bro","custom":true}],"id":"39"},{"name":"Caprice No. 12, Comodo","label":"Caprice No. 12, Comodo 3189","source":"Rode 24 Caprices for Violin","tempo":"120","measures":[{"measure":"Lookal","tempo":"200","strategies":[{"label":"Connected Notes","id":"9","description":"All note changes take place in the middle of each bow. A given note begins in the middle of the bow, and its duration continues through the bow change until the bow returns again to the middle of the bow. All notes are given an equal rhythm and bow-distribution (one half of the bow in each direction)."},{"label":"Milshko","id":"31890","description":"Use the milshko and stuff like that, what is it about other stories and you know but the thing is that I don't know so much as I thought I did.","custom":true}],"id":0},{"measure":"Mishko","tempo":"235","strategies":[{"label":"Roasting","id":"999","description":"You should roast bro"},{"label":"Listen","id":"20","description":""},{"label":"Record","id":"29","description":""}],"id":1},{"measure":"Seemotam","tempo":"140","strategies":[{"label":"Note Doubling","id":"2","description":"Perform the given patterns (DDSS, SSDD, DSSD, SDDS) on a passage in groups of four consecutive notes (no more than two groups at a time). Play each note assigned a 'D' twice, and each note assigned an 'S' once (D = Double, S = Single). All notes, regardless of their printed rhythm, are given equal rhyhtmic values and are practiced with a metronome. \n\nOnce a pattern is learned and you are able to correctly perform the pattern on the selected notes, reinforce the passage following the general rule: once correctly while reading your music, twice correctly without reading your music."},{"label":"Stopped Bows","id":"8","description":"Practice bow distribution within one bow stroke by stopping after each note in a continuous bow. Each note should receive the appropriate bow division as assigned within the given bow direction."}],"id":2}],"strategies":[],"id":"3189"},{"name":"Caprice No. 15, Presto","label":"Caprice No. 15, Presto 3216","source":"Paganini 24 Capries for Violin","tempo":"570","measures":[{"measure":"Ureikol","tempo":"120","strategies":[{"label":"Note Doubling","id":"2","description":"Perform the given patterns (DDSS, SSDD, DSSD, SDDS) on a passage in groups of four consecutive notes (no more than two groups at a time). Play each note assigned a 'D' twice, and each note assigned an 'S' once (D = Double, S = Single). All notes, regardless of their printed rhythm, are given equal rhyhtmic values and are practiced with a metronome. \n\nOnce a pattern is learned and you are able to correctly perform the pattern on the selected notes, reinforce the passage following the general rule: once correctly while reading your music, twice correctly without reading your music."}],"id":0},{"measure":"Smalshok","tempo":"220","strategies":[{"label":"Metronome Drilling","id":"28","description":""},{"label":"Listen","id":"20","description":""}],"id":1},{"measure":"Lugtungal","tempo":"330","strategies":[{"label":"Rapid Rhythms","id":"5","description":"Determine a group of notes in groups of either 3, 4, 6, or 8. To begin, the first note of each group receives its own beat. The remaining notes are played in rapid succession within their own beat, distributed equally across the beat. For variation, displace the long note by one position in the group until you have cycled through all possible combinations. Ex: L SSSSSSS becomes SL SSSSSS, etc."}],"id":2}],"strategies":[],"id":"3216"}];
/*         vueThis.selectedPieces = [{"notes":"yo there","link":"https://www.youtube.com/watch?v=NUfvht7aJPQ","name":"Bourree 2","label":"Bourree 2 39","source":"Suzuki Book 3","tempo":"200","measures":[],"strategies":[{"label":"Clap","id":"19","description":""},{"label":"Record","id":"29","description":""},{"label":"Slow Practice","id":"24","description":""},{"label":"Petersen","id":"39","description":"here bro","custom":true}],"id":"39"},{"name":"Caprice No. 12, Comodo","label":"Caprice No. 12, Comodo 3189","source":"Rode 24 Caprices for Violin","tempo":"120","measures":[{"measure":"Lookal","tempo":"200","strategies":[{"label":"Connected Notes","id":"9","description":"All note changes take place in the middle of each bow. A given note begins in the middle of the bow, and its duration continues through the bow change until the bow returns again to the middle of the bow. All notes are given an equal rhythm and bow-distribution (one half of the bow in each direction)."},{"label":"Milshko","id":"31890","description":"Use the milshko and stuff like that, what is it about other stories and you know but the thing is that I don't know so much as I thought I did.","custom":true}],"id":0},{"measure":"Mishko","tempo":"235","strategies":[{"label":"Roasting","id":"999","description":"You should roast bro"},{"label":"Listen","id":"20","description":""},{"label":"Record","id":"29","description":""}],"id":1},{"measure":"Seemotam","tempo":"140","strategies":[{"label":"Note Doubling","id":"2","description":"Perform the given patterns (DDSS, SSDD, DSSD, SDDS) on a passage in groups of four consecutive notes (no more than two groups at a time). Play each note assigned a 'D' twice, and each note assigned an 'S' once (D = Double, S = Single). All notes, regardless of their printed rhythm, are given equal rhyhtmic values and are practiced with a metronome. \n\nOnce a pattern is learned and you are able to correctly perform the pattern on the selected notes, reinforce the passage following the general rule: once correctly while reading your music, twice correctly without reading your music."},{"label":"Stopped Bows","id":"8","description":"Practice bow distribution within one bow stroke by stopping after each note in a continuous bow. Each note should receive the appropriate bow division as assigned within the given bow direction."}],"id":2},{"measure":"Alairiton","tempo":"280","strategies":[{"label":"Stopped Bows","id":"8","description":"Practice bow distribution within one bow stroke by stopping after each note in a continuous bow. Each note should receive the appropriate bow division as assigned within the given bow direction."},{"label":"Finger Tapping","id":"12","description":"Practice a finger pattern or passage of music by tapping your fingers to their place without the use of the bow. You should hear a clear tone produced by the tapping of each finger as it is placed, as well as some sound as the finger is lifted away from the string. Each finger should be placed correctly and in tune, with careful attention to correctly shape each finger as it comes in contact with the instrument."},{"label":"Subito Dynamics","id":"22","description":"Perfrom a passage of music with the corresponding dynamic indicated. Stop immediately before the next dynamic marking, maintaining contact with the instrument (bow and left hand). Begin the new passage within the correct rhythmic group and beat placement in the new dynamic."},{"label":"The Medicine","id":"1","description":"1) Say all Finger Names, 1 note per beat\n2) Say all Note Names, 1 note per beat\n3) Repeat steps 1 and 2, with correct rhythm instead of 1 note per beat\n4) Sing all Finger Names, 1 note per beat\n5) Sing all Note Names, 1 note per beat\n6) Repeat steps 4 and 5 with correct rhythm instead of 1 note per beat"},{"label":"Transcribe","id":"30","description":""},{"label":"Rapid Rhythms","id":"5","description":"Determine a group of notes in groups of either 3, 4, 6, or 8. To begin, the first note of each group receives its own beat. The remaining notes are played in rapid succession within their own beat, distributed equally across the beat. For variation, displace the long note by one position in the group until you have cycled through all possible combinations. Ex: L SSSSSSS becomes SL SSSSSS, etc."},{"label":"Half-tempo, Full-tempo","id":"25","description":""},{"label":"Metronome Drilling","id":"28","description":""},{"label":"New Finger Shifting","id":"11","description":"Prior to performing a shift, identify the  following: \n1) The new finger used after the shift occurs - this finger is the 'new finger'.\n2) The old position the left hand departs from prior to performing the given shift \n3) The note the new finger would be placed on in the old position - this is your connection note\n\nNext, add the connection note to the passage:\na) The connection-note and the new-finger note each receive their own beat and their own bow\nb) The connection-note and the new-finger note each receive their own beat but share the same bow (evenly split)\nc) The connection-note and the new-finger note share a beat (even rhythmic divisions) and bow (evenly split)\nd) The connection-note and the new-finger note share a beat with the connection note performed as a grace note with as little bow possible"},{"label":"Note Doubling (Rhythmic)","id":"3","description":"Perform the given patterns (DDSS, SSDD, DSSD, SDDS) on a passage in groups of four consecutive notes. Play each note assigned a 'D' twice, and each note assigned an 'S' once (D = Double, S = Single). Regardless of the printed rhythm, notes designated with a 'D' are performed as a pair of eighth notes while those designated with an 'S' are performed as quarter note rhythms and are practiced with a metronome. \r\n\r\nOnce a pattern is learned and you are able to correctly perform the pattern on the selected notes, reinforce the passage following the general rule: once correctly while reading your music, twice correctly without reading your music."}],"id":3},{"measure":"Sniggle","tempo":"Simgee","strategies":[{"label":"Chord Layers","id":"16","description":"Practice a chord passage with the following steps:\n1) Perform the bottom notes alone\n2) Perform the top notes alone\n3) Perform the bottom notes alone while placing the corresponding fingers down for the top notes\n4) Perform the top notes along while placing the corresponding fingers down for the bottom notes\n5) Perform the top and bottom notes simultaneously"}],"id":4},{"measure":"Gnarly Cat","tempo":"30293","strategies":[{"label":"Add a note","id":"21","description":""}],"id":5},{"measure":"Very fast man from the ancient world.","tempo":"2342","strategies":[{"label":"Backwards","id":"13","description":"Perform a measure or passage of music in reverse order:\n1) Without rhythm or bowings\n2) With rhythm, no bowings\n3) With bowings, no rhythm\n4) With bowings and rhythm"}],"id":6},{"measure":"60","tempo":"2023","strategies":[{"label":"Chord Layers","id":"16","description":"Practice a chord passage with the following steps:\n1) Perform the bottom notes alone\n2) Perform the top notes alone\n3) Perform the bottom notes alone while placing the corresponding fingers down for the top notes\n4) Perform the top notes along while placing the corresponding fingers down for the bottom notes\n5) Perform the top and bottom notes simultaneously"},{"label":"Mildew Friends","id":"31897","description":"Mildew friends are my friends and stuff like that.","custom":true},{"label":"NewsherMaw","id":"31897","description":"Newshe Maw and you know it broooo","custom":true},{"label":"Leoranical","id":"31897","description":"Sindon Nairandon","custom":true},{"label":"Serindoi ","id":"31897","description":"Pawelot din","custom":true},{"label":"Mirshelton yousgro","id":"31897","description":"Miraidolic ds","custom":true},{"label":"Hinterlands","id":"31897","description":"Hinterlands are a good place to be man.","custom":true},{"label":"Mishko libs","id":"31897","description":"Mishko Libs my friend.","custom":true},{"label":"Ingruancy dishnier.","id":"31897","description":"it's a good strat man","custom":true},{"label":"Silmo tishroinker","id":"31897","description":"Add a description here.","custom":true},{"label":"Peisheronic Liquo","id":"31897","description":"Here is another one brooog","custom":true},{"label":"Pashion Fruity","id":"31897","description":"Play with passion and fruitiness.","custom":true}],"id":7}],"strategies":[],"id":"3189"},{"name":"Caprice No. 15, Presto","label":"Caprice No. 15, Presto 3216","source":"Paganini 24 Capries for Violin","tempo":"570","measures":[{"measure":"Ureikol","tempo":"120","strategies":[{"label":"Note Doubling","id":"2","description":"Perform the given patterns (DDSS, SSDD, DSSD, SDDS) on a passage in groups of four consecutive notes (no more than two groups at a time). Play each note assigned a 'D' twice, and each note assigned an 'S' once (D = Double, S = Single). All notes, regardless of their printed rhythm, are given equal rhyhtmic values and are practiced with a metronome. \n\nOnce a pattern is learned and you are able to correctly perform the pattern on the selected notes, reinforce the passage following the general rule: once correctly while reading your music, twice correctly without reading your music."},{"label":"Clap","id":"19","description":""}],"id":0},{"measure":"Smalshok","tempo":"220","strategies":[{"label":"Metronome Drilling","id":"28","description":""},{"label":"Listen","id":"20","description":""}],"id":1},{"measure":"Lugtungal","tempo":"330","strategies":[
            {"label":"Rapid Rhythms","id":"5","description":"Determine a group of notes in groups of either 3, 4, 6, or 8. To begin, the first note of each group receives its own beat. The remaining notes are played in rapid succession within their own beat, distributed equally across the beat. For variation, displace the long note by one position in the group until you have cycled through all possible combinations. Ex: L SSSSSSS becomes SL SSSSSS, etc."}],"id":2}],"strategies":[],"id":"3216","notes":"Numachoochangatori you know what I am talking about?  Stuff like that?"}];
        vueThis.step1 = false;
        vueThis.step4 = true;
        vueThis.step = 4; */
    
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
        customStrategy : {
            title:'',
            id:'',
            description:'',
            strategiesRef:[]
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
        showModal: false,
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
            

            if(this.selectedStrategy[id]){

                if(!this.selectedStrategy[id].id){
                    this.customStrategy.id = id;
                    this.customStrategy.title = this.selectedStrategy[id];
                    this.customStrategy.strategiesRef = strategies;
                    this.showModal = true;
                }
                else {
                    strategies.push(this.selectedStrategy[id]);
                    delete this.selectedStrategy[id];
                }
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
        pdf: function(){
            var doc = examples.spans(this.selectedPieces);
            doc.save('checkList.pdf');
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
    },
    methods: {
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

    doc.setFontSize(9);
    doc.setFontType('bold');

    doc.rect(10, 40, 184, 40); //x,y,width,height
    doc.text('Piece', 12, 63);
    doc.rect(194, 40, 85, 40); //x,y,width,height
    doc.text('Practice Passage', 196, 63);
    doc.rect(279, 40, 90, 40); //x,y,width,height
    doc.text('Practice Strategy', 281, 63);

    doc.rect(369, 40, 216, 40); //x,y,width,height
    doc.line(369, 60, 585, 60);

    doc.line(369+24*1,60,369+24*1,80);
    doc.line(369+24*2,60,369+24*2,80);
    doc.line(369+24*3,60,369+24*3,80);

    doc.line(369+24*4,60,369+24*4,80);
    doc.line(369+24*5,60,369+24*5,80);
    doc.line(369+24*6,60,369+24*6,80);

    doc.line(369+24*7,60,369+24*7,80);

    //doc.line(369+24*1,60,369+24*1,80);

    doc.text('M', 369+(24*1-16), 73);
    doc.text('T', 369+(24*2-16), 73);
    doc.text('W', 369+(24*3-16), 73);
    doc.text('H', 369+(24*4-16), 73);
    doc.text('F', 369+(24*5-16), 73);
    doc.text('Sat', 365+(24*6-16), 73);
    doc.text('Sun', 365+(24*7-16), 73);
    doc.text('Mastery', 369+(24*8-16), 73);


    doc.setFontType('normal');

    doc.text('Mark time spent / check days practiced', 387, 53);



}

