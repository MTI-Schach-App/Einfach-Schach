export type ProgressProps= {
    /** number of column that is needed for bar*/
    column?: number
    /** progression */
    progress?: number
    /** color of progress */
    color?: string   
    /** chapter already completed */
}

export default function ProgressBar({ 
    column, 
    progress, 
    color='#287233'
    }:
    ProgressProps) {
  
    let arr = Array.from({length: column}, (_,i) => i+1);
   
    return(
        <div>
            <table aria-label={`fortschrittsbalken, fortschritt: ${progress} von ${arr.length}`} style={{margin: '-1px 1px 1px -1px', width:'100%', textAlign: 'center', 
                fontSize: '8px', borderSpacing: 0, tableLayout: 'fixed', border: '1px solid black'}}>
                <tr>
                    {arr.map((col) => (
                        <td style={{padding:0, 
                                backgroundColor: (col <= progress ? color : 'transparent'),
                                color: (col <= progress ? 'white' : 'black')}}>
                        {col}</td>
                    ))}
                </tr>
            </table>
            <div style={{height:'1em'}}></div>
        </div>        
    );
}