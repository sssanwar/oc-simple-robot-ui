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

const mapWidth = 100
const mapHeight = 100
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
        <WorldMap width={mapWidth} height={mapHeight} footprints={footprints} />
      </div>
      <div className={styles.infopanel}>
        <InfoPanel location={robotData} />
      </div>
    </div>
  )
}
