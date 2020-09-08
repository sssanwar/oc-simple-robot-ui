import styles from '../styles/infopanel.module.sass'
import { RobotLocationData, CompassPoint } from 'oc-simple-robot/src/lib/models/types.model'
import { useState, ChangeEvent } from 'react'

interface InfoPanelProps {
  location?: RobotLocationData
  onSendCommand: (input: string) => void
}

export default function InfoPanel(props: InfoPanelProps) {
  const { location, onSendCommand } = props
  const [cmdString, setCmdString] = useState<string>('')

  const handleInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setCmdString(ev.target.value)
    onSendCommand(ev.target.value)
  }

  const handleReset = () => {
    setCmdString('')
  }

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
      <label className={styles.inputCommand}>Input Commands:</label>
      <textarea cols={60} rows={10} value={cmdString} onChange={handleInputChange} />
      <button onClick={handleReset}>Clear</button>
    </div>
  )
}
