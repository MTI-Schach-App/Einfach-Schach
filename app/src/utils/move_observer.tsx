import { playTypeSound } from "./audio_player";

const PIECES_TO_GER = {
    'white pawn'        : 'Weißer Bauer',
    'white rook'        : 'Weißer Turm',
    'white knight'      : 'Weißer Springer',
    'white bishop'      : 'Weißer Läufer',
    'white queen'       : 'Weiße Königin',
    'white king'        : 'Weißer König',

    'black pawn'        : 'Schwarzer Bauer',
    'black rook'        : 'Schwarzer Turm',
    'black knight'      : 'Schwarzer Springer',
    'black bishop'      : 'Schwarzer Läufer',
    'black queen'       : 'Schwarze Königin',
    'black king'        : 'Schwarzer König',
}
const translate = (string : string) =>{
    return PIECES_TO_GER[string];
}

export class PieceHandler {
    private data_pieces : Array<HTMLElement>;
    private data_squares : Array<HTMLElement>;
    private parent : HTMLElement;

    constructor(){
        this.data_pieces = new Array<HTMLElement>();
        this.data_squares = new Array<HTMLElement>();
    }
    setUp = (board : HTMLElement) => {
        this.parent = board;
        const children = this.parent.childNodes;
        children.forEach((child) =>{
            let textField = this.createTextField(child);
            this.data_pieces.push(textField); 
            this.parent.append(textField);
        });
    }
    private createTextField = (child : Node) =>{
        const transformValue = window.getComputedStyle((child as HTMLElement)).transform;
        let matrix = new WebKitCSSMatrix(transformValue);
        let textField = document.createElement('div');
        textField.style.height = this.parent.getBoundingClientRect().height / 8 + 'px';
        textField.style.width = this.parent.getBoundingClientRect().width / 8 + 'px';
        textField.style.position = 'absolute';     
        textField.style.top = matrix.f + 'px';  
        textField.style.left = matrix.e + 'px';  
        textField.style.zIndex = '2';
        textField.style.opacity = '0.4';
        textField.id = child['cgKey'];
        (child as HTMLElement).id = child['cgKey'];

        textField.role = 'application';
        if((child as HTMLElement).className.includes('move-dest')){
            if((child as HTMLElement).className.includes('oc')){
                textField.ariaLabel = `Schlag auf ${child['cgKey']}`; 
            }
            else{
                textField.ariaLabel = `Zug auf ${child['cgKey']}`; 
            }
            textField.ariaRoleDescription = 'möglicher Zug';
        }
        else if((child as HTMLElement).className === 'selected'){
            textField.ariaLabel = `Figur auf ${child['cgKey']} ausgewählt`; 

            textField.ariaRoleDescription = 'ausgewählte schachfigur';
        }
        else{
            textField.ariaLabel = `${translate((child as HTMLElement).className)} auf ${child['cgKey']}`; 
            textField['type'] = this.getType((child as HTMLElement));
            textField.ariaRoleDescription = 'schachfigur';
        }        
       
        return textField;
    }
    
    eventHandling = () =>{
        if(this.check){
            let squares = new Array<HTMLElement>();
            let move_modus = false;

            const actionModeOn = () =>{
                this.data_pieces.forEach((elem) => elem.style.display='none')
                squares.forEach((square) => {
                    let textField = this.createTextField(square);
                    this.data_squares.push(textField);
                    this.parent.append(textField);                
                });  
                squares = new Array<HTMLElement>();
                boardObserver.observe(this.parent, 
                    { attributes: false, childList: true, subtree: false }); 
            }
            const actionModeOff = () =>{
                this.data_squares.forEach((square) => {
                    this.parent.removeChild(square);
                })
                this.data_squares = new Array<HTMLElement>();
                this.data_pieces.forEach((elem) => elem.style.display=null)
                boardObserver.observe(this.parent, 
                    { attributes: false, childList: true, subtree: false });      
            }

            const boardObserver = new MutationObserver(function(mutationList, observer){
                for(const mutation of mutationList){
                    let addedSquares = mutation.addedNodes;
                    let removedSquares = mutation.removedNodes;

                    if(addedSquares.length > 0){
                        addedSquares.forEach((square) => {
                            if((square as HTMLElement).className.includes('move-dest') || 
                            (square as HTMLElement).className === 'selected'){
                                squares.push((square as HTMLElement));
                                move_modus = true;
                            }
                        });    
                        observer.disconnect();             
                    }
                    if(removedSquares.length > 0){
                        removedSquares.forEach((square) => {
                            if((square as HTMLElement).className.includes('move-dest') || 
                            (square as HTMLElement).className === 'selected'){
                                move_modus = false;
                            }
                        })
                        observer.disconnect();                 
                    }  
                    
                }
                if(move_modus) actionModeOn();
                else actionModeOff();
            })
            boardObserver.observe(this.parent, 
                { attributes: false, childList: true, subtree: false });


            const adjustPosition = (child : Node) =>{
                let textField = this.data_pieces.find((elem) => elem.id === (child as HTMLElement).id);
                if(textField != null){
                    if(child.parentElement == null){
                        this.parent.removeChild(textField);
                        let pos = this.data_pieces.indexOf(textField);
                        this.data_pieces.splice(pos,1);

                        return;
                    }
                    else{
                        const transformValue = window.getComputedStyle((child as HTMLElement)).transform;
                        let matrix = new WebKitCSSMatrix(transformValue);                    
                        textField.style.top = matrix.f + 'px';  
                        textField.style.left = matrix.e + 'px';
                        textField.ariaHidden = 'true';

                        return textField;
                    }                
                }
                else{
                    textField = this.data_squares.find((elem) => elem.id === (child as HTMLElement).id);

                    const transformValue = window.getComputedStyle((child as HTMLElement)).transform;
                    let matrix = new WebKitCSSMatrix(transformValue);                    
                    textField.style.top = matrix.f + 'px';  
                    textField.style.left = matrix.e + 'px';
                    textField.ariaHidden = 'true';

                    return textField;
                }
                              
            }   
            const childObserver = new MutationObserver(function(mutationList){
                let child = null, textField = null;
                for(const mutation of mutationList){
                    child = mutation.target;
                    textField = adjustPosition(child);
                }
                if(!(child as HTMLElement).className.includes('anim')){
                    //textField.id = child['cgKey'];
                    //(child as HTMLElement).id = child['cgKey'];

                    if((child as HTMLElement).className.includes('move-dest')){
                        if((child as HTMLElement).className.includes('oc')) 
                            textField.ariaLabel = `Schlag auf ${child['cgKey']}`; 
                        else 
                            textField.ariaLabel = `Zug auf ${child['cgKey']}`;                         
                    }
                    else if((child as HTMLElement).className === 'selected')
                        textField.ariaLabel = `Figur auf ${child['cgKey']} ausgewählt`; 
                    else 
                        textField.ariaLabel = `${translate((child as HTMLElement).className)} auf ${child['cgKey']}`; 
                }
            });
            this.parent.childNodes.forEach((child) =>{
                if((child as HTMLElement).tagName === 'PIECE' || (child as HTMLElement).tagName === 'SQUARE'){
                    childObserver.observe(child, 
                        { attributes: true, childList: false, subtree: false })
                }                
            }); 
            
            const adjustSize = (board : HTMLElement) =>{
                this.data_pieces.forEach((piece) => {
                    piece.style.width = board.getBoundingClientRect().width / 8 + 'px';
                    piece.style.height = board.getBoundingClientRect().height / 8 + 'px';
                });
                this.data_squares.forEach((square) => {
                    square.style.width = board.getBoundingClientRect().width / 8 + 'px';
                    square.style.height = board.getBoundingClientRect().height / 8 + 'px';
                });
            }
            const boardSizeObserver = new ResizeObserver(function(mutationList){
                for(const mutation of mutationList){
                    let board = mutation.target;
                    adjustSize((board as HTMLElement));
                }
            });
            boardSizeObserver.observe(this.parent);
        }   
    }
    private check = () =>{
        if(this.parent != null) return true;
        else return false;
    }
    private getType = (child : HTMLElement) =>{
        return child.className.split(' ')[1];
    }
    private playSound = (event) =>{
        playTypeSound(event.target['type']);
        window.removeEventListener('mousedown', this.playSound);
    }
    handleSound = (on : boolean) =>{
        if(on){
            window.addEventListener('mousedown', this.playSound);
        }        
    }
}


