import styles from '../styles/infopanel.module.sass'
import { CompassPoint, RobotLocationData } from 'oc-simple-robot/src/lib/models/types.model'

interface InfoPanelProps {
  selectedRobot?: RobotLocationData
}

export default function InfoPanel(props: InfoPanelProps) {
  const { selectedRobot } = props

  return (
    <div className={styles.infopanel}>
      <p>
        <label>Robot ID:</label> {selectedRobot?.id || '-'}
      </p>
      <p>
        <label>Position:</label> {selectedRobot ? selectedRobot.position.x : '-'},{' '}
        {selectedRobot ? selectedRobot.position.y : '-'}
      </p>
      <p>
        <label>Compass:</label> {selectedRobot ? CompassPoint[selectedRobot.compassData.point] : '-'}
      </p>
    </div>
  )
}
