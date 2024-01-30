//audio output for start
export function setAudioStart(){
    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = 'Weiß beginnt!';
}

//audio output for turn
export function setAudioTurn(c:string){
    let color = c == 'w' ? 'Weiß' : 'Schwarz';

    let text = `${color} ist am Zug.`
    
    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = text;
}

//audio output for generell moves
export function setAudioMove(t:string, destination:string){

    let type = '';
    if(t == 'p') type =    'Bauer'
    if(t == 'n') type = 'Springer'
    if(t == 'b') type =   'Läufer'
    if(t == 'r') type =     'Turm'
    if(t == 'q') type =  'Königin'
    if(t == 'k') type =    'König'

    let text = `${type} auf ${destination}`;

    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = text;
}
//audio output for special moves
export function setAudioSpecMove(move:string, c:string){
    let color = c == 'w' ? 'Weiß' : 'Schwarz';
    
    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = `${color} führt ${move} durch.`;    
}

//audio output for promotion
export function setAudioPromotion(c:string, p:string){
    let color = c == 'w' ? 'Weiß' : 'Schwarz';

    let text = c == 'w' ? '' : 'Achtung! ';

    let piece = '';
    if(p == 'n') piece = 'einen Springer'
    if(p == 'b') piece =   'einen Läufer'
    if(p == 'r') piece =     'einen Turm'
    if(p == 'q') piece =   'eine Königin'

    text += `${color} erhält ${piece}`;

    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = text;    
}

//audio output for undoing a move
export function setAudioUndo(){
    if(document.querySelector('#audio_info') != null) 
        document.querySelector('#audio_info').innerHTML = 'Ein Zug zurück.';    
}

//change system -> slimer, more simple design

export function setAudioInfo(str: string) {
    let text = '';
    if(str === 'error'){
        text = 'Ein Fehler ist aufgetreten.'+ 
        'Das Schachbrett muss ausgewählt sein, um Modi nutzen zu können.' +
        'Für weitere Informationen, klicke i';
    }
    if(str === 'info'){
        text = 'Um das Schachbrett auszuwählen, klicke b ' +
               'Um den Modus "Beobachten" auszuwählen, klicke w ' +
               'Um den Modus "Aktion" auszuwählen, klicke a ' +
               'Sobald du einen Modus gewählt hast, klicke p um eine Schachfigur auszuwählen, '+
               'klicke Shift+p, um eine vorherige Schachfigur auszuwählen.' +
               'Zum Bestätigen, klicke Enter.';
               //add zug zurück, historie
    }
    if(str === 'board') text = 'Schachbrett ausgewählt';
    if(str === 'watch') text = '"Beobachten" ausgewählt';
    if(str === 'action') text = '"Aktion" ausgewählt';
    if(text != '' && document.querySelector('#audio_feedback') != null) 
        document.querySelector('#audio_feedback').innerHTML = text;    
}

export function setAudioFeedback(str: string, selected?: string) {
    let text = '';
    if(selected === 'selected') text = `${str} ausgewählt`;
    else text = str;
    if(document.querySelector('#audio_feedback') != null) 
        document.querySelector('#audio_feedback').innerHTML = text; 
}