export default function HiddenFieldForScreenReader({id_name, visibility}) {
    let top, position;
    if(visibility) {top = '0px'; position='relative';}
    else {top = '-99999px'; position='absolute';}
    return(
        <div aria-live="assertive" aria-atomic 
        style={{position: position, top: top}}>
            <p id={id_name} role='strong'></p>
        </div>
    );
}  
