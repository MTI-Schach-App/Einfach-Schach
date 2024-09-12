export type ProgressProps = {
    /** Number of columns needed for the bar */
    column?: number;
    /** Progression */
    progress?: number;
    /** Color of progress */
    color?: string;
    /** Chapter already completed */
  };
  
  export default function ProgressBar({
    column = 10, // default value for columns
    progress = 0, // default value for progress
    color = '#287233', // default color for progress
  }: ProgressProps) {
    let arr = Array.from({ length: column }, (_, i) => i + 1);
  
    return (
      <div style={{ width: '100%' }}>
        <table
          aria-label={`fortschrittsbalken, fortschritt: ${progress} von ${arr.length}`}
          style={{
            margin: '10px 0',
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            borderSpacing: 0,
            tableLayout: 'fixed',
            borderRadius: '10px',
            overflow: 'hidden', 
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          }}
        >
          <tr>
            {arr.map((col) => (
              <td
                key={col}
                style={{
                  padding: '8px 0',
                  backgroundColor: col <= progress ? color : '#f0f0f0', 
                  color: col <= progress ? 'white' : '#888',
                  transition: 'background-color 0.3s ease, color 0.3s ease', 
                  fontWeight: col <= progress ? 'bold' : 'normal',
                }}
              >
                {col}
              </td>
            ))}
          </tr>
        </table>
        <div style={{ height: '1em' }}></div>
      </div>
    );
  }
  