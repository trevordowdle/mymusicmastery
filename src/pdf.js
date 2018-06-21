export function generatePDF(data) {

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
            if(data.row.raw.measures && data.row.raw.measures.length){
                row.height = 200;
            }
            else if(data.row.strategies) {
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
                if(data.row.raw.measures && data.row.raw.measures.length){

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

                                if(trackHeight < 40){
                                    trackHeight = 40;
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

                    if(!data.row.raw.strategies){
                        data.row.raw.strategies = [];
                    }

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

                    if(!data.row.raw.strategies.length){
                     
                        if(data.row.raw.notes){

                            let noteBlocks = breakUptext(80,data.row.raw.notes),
                                hasLink = 0;

                            if(data.row.raw.link){
                                hasLink = 1;
                                doc.setTextColor(0,0,255);
                                doc.text(data.row.raw.link,cell.x+4,cell.y+(20)+41+((noteBlocks.length+1)*12));
                                doc.setTextColor(0,0,0);
                            }

                            doc.rect(cell.x, cell.y+(20)+20, 391, 20+((hasLink+noteBlocks.length)*20));
                            doc.text('Notes / Comments:',cell.x+2,cell.y+(20)+33);
                            noteBlocks.map((block,indexBlock)=>{
                                doc.text(block,cell.x+4,cell.y+(20)+33+((indexBlock+1)*12)); 
                            });  
                        }
                        
                    }
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
            sourceCollect = word += ' ';
        }
    });
    if(sourceCollect){
        textBlocks.push(sourceCollect);
    }
    return textBlocks;
};

export var breakUptext;

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