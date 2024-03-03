const TYPES = {
    'p' : 'bauer',
    'b' : 'läufer',
    'r' : 'turm',
    'n' : 'springer',
    'q' : 'königin',
    'k' : 'könig'
}
const getPiece = (piece : string) =>{
    return TYPES[piece];
}
const PROMOTION = {
    'b' : 'ein läufer',
    'r' : 'ein turm',
    'n' : 'ein springer',
    'q' : 'eine königin',
}
const getPromotionPiece = (type : string) =>{
    return PROMOTION[type];
}
const COLOR = {
    'b' : 'schwarz',
    'w' : 'weiß'
}
const getColor = (type : string) =>{
    return COLOR[type];
}
declare type HiddenWindowProps = {
    //type of call
    type : string,

    //color of piece
    color? : string,

    //piece 
    piece? : string,

    //destination of move
    destination? : string

}
export function callHiddenWindow({
    type,
    color,
    piece,
    destination
}: HiddenWindowProps){
    let text = '';
    switch(type){
        case 'start': text = 'weiß beginnt';
        break;
        case 'turn': text = `${getColor(color)} ist am zug`;
        break;
        case 'undo': text = 'ein zug zurück'
        break;
        case 'promotion': text = `${getColor(color)} erhält ${getPromotionPiece(piece)}`;
        break;
        case 'rochade': text = `${getColor(color)} führt eine rochade durch`;
        break;
        case 'normal' : text = `${getPiece(piece)} auf ${destination}`;
        break;
        case 'capture' : text = piece === 'q' ? `${getColor(color)}e ${getPiece(piece)} geschlagen` : `${getColor(color)}er ${getPiece(piece)} geschlagen`;
        break;
        case 'check' : text = `${getColor(color)} ist Schach gesetzt worden`;
        break;
        case 'won' : text = `Hurrah. Du hast gewonnen!`;
        break;
        case 'lose' : text = `Du hast leider verloren.`;
        break;
    } 
    if(document.getElementById('audio_info') != null){
        return(
            document.getElementById('audio_info').innerHTML = text
        )
    }
    
}