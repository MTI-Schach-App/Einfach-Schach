import { ListItem } from '@mui/material';

const TYPES = {
    'p' : 'Bauer',
    'b' : 'Läufer',
    'r' : 'Turm',
    'n' : 'Springer',
    'q' : 'Königin',
    'k' : 'König'
}
const COLOR = {
    'w' : 'Weiß',
    'b' : 'Schwarz'
}
const getType = (str : string) =>{
    return TYPES[str];
}
const getColor = (str : string) =>{
    return COLOR[str];
}

declare type ChessPiece = {
    action : () => void,
    color: string;
    type: string;
    cgKey: any;
    role?: string;
    aria_roledescription?: string;
    focus: boolean;
    blind: boolean;
};

const createLabelPiece = (type : string, color : string, cgKey : string) =>{
    let label = type === 'q' ? `${getColor(color)}e ${getType(type)} auf ${cgKey}` : 
                               `${getColor(color)}er ${getType(type)} auf ${cgKey}`
    return label; 
}

export function ChessPiece ({
    action,
    color,
    type,
    cgKey,
    role='application',
    aria_roledescription= createLabelPiece(type, color, cgKey),
    focus,
    blind
}: ChessPiece){   
    const tabIndex = focus ? 0 : 1;
    return(
        <td
            onClick={action}
            onKeyPress={action}
            role={role}
            aria-roledescription={aria_roledescription}
            tabIndex={tabIndex}
            {...{'t': type, 'c': color, 'cgKey': cgKey}}
            style={{backgroundColor: blind ? 'red' : 'none',
                    cursor: 'pointer'}}
        >
        </td>
    );    
}

declare type MoveSquare = {
    action : () => void,
    capture?: boolean;
    normal?: boolean;
    selected?: boolean;
    cgKey: any;
    role?: string;
    aria_roledescription?: string;
    blind: boolean;
};

const createLabelMove = (capture : boolean, normal : boolean, selected : boolean, cgKey : any) =>{
    if(capture) return `Schlag auf ${cgKey}`
    if(normal) return `Zug auf ${cgKey}`
    if(selected) return `ausgewählte Figur auf ${cgKey}`
}

export function MoveSquare ({
    action,
    capture,
    normal,
    selected,
    cgKey,
    role='application',
    aria_roledescription= createLabelMove(capture, normal, selected, cgKey),
    blind
}: MoveSquare){
    
    return(        
        <td 
            onClick={action}
            onKeyPress={action}
            tabIndex={0}
            role={role}
            aria-roledescription={aria_roledescription}
            {...{'cgKey': cgKey}}
            style={{backgroundColor: blind ? 'green' : 'none', 
                    cursor: 'pointer'}}
            >
        </td>
    );
    
} 