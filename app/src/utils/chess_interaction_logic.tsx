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
    variant: number,
    action : () => void,
    size?: number,
    color: string;
    type: string;
    cgKey: any;
    role?: string;
    aria_roledescription?: string;
    focus: boolean;
};

const createLabelPiece = (type : string, color : string, cgKey : string) =>{
    let label = type === 'q' ? `${getColor(color)}e ${getType(type)} auf ${cgKey}` : 
                               `${getColor(color)}er ${getType(type)} auf ${cgKey}`
    return label; 
}

export function ChessPiece ({
    variant,
    action,
    size,
    color,
    type,
    cgKey,
    role='application',
    aria_roledescription= createLabelPiece(type, color, cgKey),
    focus
}: ChessPiece){   
    const tabIndex = focus ? 0 : 1;
    if(variant != 2){
        return(
            <td
                onClick={action}
                onKeyPress={action}
                role={role}
                aria-roledescription={aria_roledescription}
                tabIndex={tabIndex}
                {...{'t': type, 'c': color, 'cgKey': cgKey}}
                style={{backgroundColor: 'red',
                        cursor: 'pointer'}}
            >
            </td>
        );
    }
    else{
        return(
            <ListItem style={{margin: 0, padding: '2px'}}>
                <div                   
                    onClick={action}
                    onKeyPress={action}
                    role={role}
                    aria-roledescription={aria_roledescription}
                    tabIndex={tabIndex}
                    {...{'t': type, 'c': color, 'cgKey': cgKey}}
                    style={{backgroundColor: 'red', height: size, width: size,
                            padding: 0, cursor: 'pointer'}}
                ></div>
            </ListItem>
        );
    }
    
}

declare type MoveSquare = {
    variant: number,
    action : () => void,
    size?: number,
    capture?: boolean;
    normal?: boolean;
    selected?: boolean;
    cgKey: any;
    role?: string;
    aria_roledescription?: string;
};

const createLabelMove = (capture : boolean, normal : boolean, selected : boolean, cgKey : any) =>{
    if(capture) return `Schlag auf ${cgKey}`
    if(normal) return `Zug auf ${cgKey}`
    if(selected) return `ausgewählte Figur auf ${cgKey}`
}

export function MoveSquare ({
    variant,
    action,
    size,
    capture,
    normal,
    selected,
    cgKey,
    role='application',
    aria_roledescription= createLabelMove(capture, normal, selected, cgKey),
}: MoveSquare){
    if(variant != 2){
        return(        
            <td 
                onClick={action}
                onKeyPress={action}
                tabIndex={0}
                role={role}
                aria-roledescription={aria_roledescription}
                {...{'cgKey': cgKey}}
                style={{backgroundColor: 'green', 
                        cursor: 'pointer'}}
                >
            </td>
        );
    }
    else{
        return(
            <ListItem style={{margin:0, padding: '2px'}}>
                <div
                    onClick={action}
                    onKeyPress={action}
                    tabIndex={0}
                    role={role}
                    aria-roledescription={aria_roledescription}
                    {...{'cgKey': cgKey}}
                    style={{backgroundColor: 'green', height: size, width: size,
                            cursor: 'pointer'}}
                ></div>
            </ListItem>
        );      
    }    
} 