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
import { parseSecondLineCommand, wait } from 'oc-simple-robot/src/lib/common/utils'

const mapWidth = 20
const mapHeight = 20
const cmdDelay = 500
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

  const onSendCommand = async (input: string) => {
    if (input.trim().length === 0) return
    const cmds = parseSecondLineCommand(input)!
    const cmdWaits = cmds.map(cmd => () => wait(cmdDelay).then(() => engine.sendCommand(cmd)))
    for (const cw of cmdWaits) await cw()
  }

  const keydownListener = (ev: KeyboardEvent) => {
    switch (ev.keyCode) {
      case 38: // up
        engine.sendCommand({ id: robotData?.id, type: ActionType.M, count: 1 })
        ev.preventDefault()
        break
      case 37: // left
        engine.sendCommand({ id: robotData?.id, type: ActionType.L, count: 1 })
        ev.preventDefault()
        break
      case 39: // right
        engine.sendCommand({ id: robotData?.id, type: ActionType.R, count: 1 })
        ev.preventDefault()
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
        <h2>
          Simple Robot UI ({mapWidth} x {mapHeight})
        </h2>
        <p>Use arrow keys to move: UP (Forward) and LEFT/RIGHT (Rotate)</p>
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
        <InfoPanel location={robotData} cmdDelay={cmdDelay} onSendCommand={onSendCommand} />
      </div>
    </div>
  )
}
