import WorldMap from '../components/worldmap'
import { GameEngine } from 'oc-simple-robot/src/lib/models/game-engine.model'
import { WorldMap as ModelWorldMap } from 'oc-simple-robot/src/lib/models/world-map.model'
import styles from '../styles/index.module.sass'

import {
  CompassPoint,
  OccupierLocationData,
  RobotLocationData,
  ActionType
} from 'oc-simple-robot/src/lib/models/types.model'
import { useEffect, useState } from 'react'
import { FootprintData } from '../lib/interfaces/model.interface'
import InfoPanel from '../components/infopanel'
import Overlay from '../components/overlay'
import { parseSecondLineCommand, wait } from 'oc-simple-robot/src/lib/common/utils'

export default function IndexPage() {
  const MAP_WIDTH = 30
  const MAP_HEIGHT = 20
  const GRID_WIDTH_PX = 700
  const DELAY = 500
  const CELL_SIZE_PX = GRID_WIDTH_PX / MAP_WIDTH

  const [footprints, setFootprints] = useState<FootprintData[]>([])
  const [robotData, setRobotData] = useState<RobotLocationData>()
  const [map] = useState(new ModelWorldMap(MAP_WIDTH, MAP_HEIGHT))
  const [engine] = useState(new GameEngine(map))

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
    const cmdWaits = cmds.map(cmd => () => wait(DELAY).then(() => engine.sendCommand(cmd)))
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
    const engineSubs = engine.asObservable().subscribe(locationData => updateFootprints(locationData))
    engine.init({ position: { x: 0, y: 0 }, compassPoint: CompassPoint.N })
    window.addEventListener('keydown', keydownListener)
    return () => {
      engineSubs.unsubscribe()
      window.removeEventListener('keydown', keydownListener)
    }
  }, [])

  return (
    <div className={styles.main}>
      <div>
        <h2>
          Simple Robot UI ({MAP_WIDTH} x {MAP_HEIGHT})
        </h2>
        <p>Use arrow keys to move: UP (Forward) and LEFT/RIGHT (Rotate)</p>
        <div className={styles.mapContainer} style={{ minWidth: GRID_WIDTH_PX }}>
          <WorldMap width={MAP_WIDTH} height={MAP_HEIGHT} cellDiameterPx={CELL_SIZE_PX} />
          {footprints.map(fp => {
            return (
              <Overlay
                key={fp.occupierId}
                mapWidth={MAP_WIDTH}
                mapHeight={MAP_HEIGHT}
                cellDiameterPx={CELL_SIZE_PX}
                footprintData={fp}
              />
            )
          })}
        </div>
      </div>
      <div className={styles.infopanel}>
        <InfoPanel location={robotData} cmdDelay={DELAY} onSendCommand={onSendCommand} />
      </div>
    </div>
  )
}
