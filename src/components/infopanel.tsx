import styles from '../styles/infopanel.module.sass'
import { RobotLocationData, CompassPoint } from 'oc-simple-robot/src/lib/models/types.model'

interface InfoPanelProps {
  location?: RobotLocationData
}

export default function InfoPanel(props: InfoPanelProps) {
  const { location } = props
  return (
    <div className={styles.infopanel}>
      <p>Robot ID: {location ? location.id : '-'}</p>
      <p>Compass point: {location ? CompassPoint[location.compassPoint] : '-'}</p>
      <p>
        Position: {location ? location.position.x : '-'}, {location ? location.position.y : '-'}
      </p>
    </div>
  )
}
