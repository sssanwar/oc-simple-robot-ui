import WorldMap from '../components/worldmap'
import { GameEngine } from 'oc-simple-robot/src/lib/models/game-engine.model'
import { WorldMap as ModelWorldMap } from 'oc-simple-robot/src/lib/models/world-map.model'
import styles from '../styles/index.module.sass'

import {
  CompassPoint,
  MapService,
  OccupierLocationData,
  RobotLocationData,
  ActionType
} from 'oc-simple-robot/src/lib/models/types.model'
import { useEffect, useState } from 'react'
import { FootprintData } from '../lib/interfaces/model.interface'
import InfoPanel from '../components/infopanel'
import Overlay from '../components/overlay'
import { parseSecondLineCommand } from 'oc-simple-robot/src/lib/common/utils'

const mapWidth = 30
const mapHeight = 30

const cellDiameterPx = 600 / mapHeight // 600 is max height in pixel
const map: MapService = new ModelWorldMap(mapWidth, mapHeight)
const engine = new GameEngine(map)

export default function IndexPage() {
  const [footprints, setFootprints] = useState<FootprintData[]>([])
  const [robotData, setRobotData] = useState<RobotLocationData>()

  const updateFootprints = (locationData: OccupierLocationData) => {
    const robotLocData = locationData as RobotLocationData
    if (robotLocData) {
      let fprints = footprints.filter(f => f.occupierId !== robotLocData.id)
      fprints.push({
        occupierId: robotLocData.id,
        coordinates: robotLocData.footprints,
        direction: robotLocData.compassPoint
      })
      setRobotData(robotLocData)
      setFootprints(fprints)
    }
  }

  const onSendCommand = (input: string) => {
    const cmds = parseSecondLineCommand(input)
    cmds?.forEach(cmd => engine.sendCommand(cmd))
  }

  const keydownListener = (ev: KeyboardEvent) => {
    switch (ev.keyCode) {
      case 38: // up
        engine.sendCommand({ id: robotData?.id, type: ActionType.M, count: 1 })
        break
      case 37: // left
        engine.sendCommand({ id: robotData?.id, type: ActionType.L, count: 1 })
        break
      case 39: // right
        engine.sendCommand({ id: robotData?.id, type: ActionType.R, count: 1 })
        break
    }
  }

  useEffect(() => {
    engine.asObservable().subscribe(locationData => updateFootprints(locationData))
    engine.init({ position: { x: 0, y: 0 }, compassPoint: CompassPoint.N })
    window.addEventListener('keydown', keydownListener)
    return () => window.removeEventListener('keydown', keydownListener)
  }, [])

  return (
    <div className={styles.main}>
      <div>
        <h3>Simple Robot UI</h3>
        <p>Use these arrow keys to move robot: UP (Forward) and LEFT/RIGHT (Rotate)</p>
        <div className={styles.mapContainer}>
          <WorldMap width={mapWidth} height={mapHeight} cellDiameterPx={cellDiameterPx} />
          {footprints.map(fp => {
            return (
              <Overlay
                key={fp.occupierId}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                cellDiameterPx={cellDiameterPx}
                footprintData={fp}
              />
            )
          })}
        </div>
      </div>
      <div className={styles.infopanel}>
        <InfoPanel location={robotData} onSendCommand={onSendCommand} />
      </div>
    </div>
  )
}
