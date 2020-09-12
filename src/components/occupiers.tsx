import styles from '../styles/occupiers.module.sass'
import { calculateSize } from '../lib/utils'
import { MapSize } from '../lib/interfaces'
import { RobotLocationData } from 'oc-simple-robot/src/lib/models/types.model'

interface OccupiersProps {
  mapSize: MapSize
  robotLocations: RobotLocationData[]
}

export default function Occupiers(props: OccupiersProps) {
  const { mapSize, robotLocations } = props
  return (
    <>
      {robotLocations.length > 0 &&
        robotLocations.map(rl => {
          const occpSize = calculateSize(rl)
          return (
            <div
              key={rl.id}
              className={styles.occupier}
              style={{
                gridArea: `${mapSize.height - (rl.position.y + occpSize.yLength - 1)} / ${
                  rl.position.x + occpSize.xLength
                }`
              }}>
              <div
                className={styles.occupierImage}
                style={{
                  transform: `rotate(${rl.compassData.degree}deg)`
                }}></div>
            </div>
          )
        })}
    </>
  )
}
