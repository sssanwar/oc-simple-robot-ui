import styles from '../styles/infopanel.module.sass'
import { RobotLocationData, CompassPoint } from 'oc-simple-robot/src/lib/models/types.model'
import { useState, ChangeEvent } from 'react'

interface InfoPanelProps {
  location?: RobotLocationData
  cmdDelay: number
  onSendCommand: (input: string) => void
}

export default function InfoPanel(props: InfoPanelProps) {
  const { location, cmdDelay, onSendCommand } = props
  const [cmdString, setCmdString] = useState<string>('M1RM4L3M2')

  const handleInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) => setCmdString(ev.target.value)
  const handleSend = () => onSendCommand(cmdString)

  return (
    <div className={styles.infopanel}>
      <p>
        <label>Robot ID:</label> {location ? location.id : '-'}
      </p>
      <p>
        <label>Position:</label> {location ? location.position.x : '-'}, {location ? location.position.y : '-'}
      </p>
      <p>
        <label>Compass:</label> {location ? CompassPoint[location.compassPoint] : '-'}
      </p>
      <label className={styles.inputCommand}>Input Commands ({cmdDelay}ms delay):</label>
      <textarea cols={50} rows={10} value={cmdString} onChange={handleInputChange} />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
