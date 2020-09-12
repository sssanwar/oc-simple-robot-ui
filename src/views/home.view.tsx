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
import React, { useEffect, useState } from 'react'
import InfoPanelContainer from '../components/infopanel.container'
import Overlay from '../components/overlay'
import { parseSecondLineCommand } from 'oc-simple-robot/src/lib/common/utils'
import { MapSize } from '../lib/interfaces'
import SettingsPanel from '../components/settingspanel'

interface HomeViewProps {
  mapSize: MapSize
  textCommands: string
  selectedRobotId?: string
  commandDelay: number
  gridWidthPx: number
  onSetDelay: (delay: number) => void
  onSetTextCommands: (cmds: string) => void
  onApplyMapSize: (mapSize: MapSize) => void
  onResetRobotData: () => void
  onClearTextCommands: () => void
  onUpdateRobotLocation: (location: RobotLocationData) => void
}

export default function HomeView(props: HomeViewProps) {
  const {
    mapSize,
    selectedRobotId,
    textCommands,
    commandDelay,
    gridWidthPx,
    onSetDelay,
    onSetTextCommands,
    onApplyMapSize,
    onResetRobotData,
    onClearTextCommands,
    onUpdateRobotLocation
  } = props
  const cellSizePx = gridWidthPx / mapSize.width
  const [engine, setEngine] = useState<GameEngine>()

  const updateLocationData = (locationData: OccupierLocationData) => {
    const robotLocData = locationData as RobotLocationData
    if (robotLocData) onUpdateRobotLocation(robotLocData)
  }

  const keydownListener = (ev: KeyboardEvent) => {
    switch (ev.key) {
      case 'ArrowUp':
        engine && engine.sendCommand({ id: selectedRobotId, type: ActionType.M, count: 1 })
        ev.preventDefault()
        break
      case 'ArrowLeft':
        engine && engine.sendCommand({ id: selectedRobotId, type: ActionType.L, count: 1 })
        ev.preventDefault()
        break
      case 'ArrowRight':
        engine && engine.sendCommand({ id: selectedRobotId, type: ActionType.R, count: 1 })
        ev.preventDefault()
        break
    }
  }

  useEffect(() => {
    if (textCommands.trim().length === 0) return
    const cmds = parseSecondLineCommand(textCommands)!
    cmds.forEach(cmd => engine && engine.sendCommand(cmd))
    onClearTextCommands()
  }, [textCommands])

  useEffect(() => {
    const newEngine = new GameEngine(new ModelWorldMap(mapSize.width, mapSize.height), commandDelay)
    onResetRobotData()
    setEngine(newEngine)
  }, [mapSize])

  useEffect(() => {
    if (!engine) return
    const engineSubs = engine.asObservable().subscribe(locationData => updateLocationData(locationData))
    engine.init({ position: { x: 0, y: 0 }, compassPoint: CompassPoint.N })
    window.addEventListener('keydown', keydownListener)
    return () => {
      engineSubs.unsubscribe()
      window.removeEventListener('keydown', keydownListener)
    }
  }, [engine])

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <h2>
          Simple Robot UI ({mapSize.width} x {mapSize.height})
        </h2>
        <p>Use arrow keys to move: UP (Forward) and LEFT/RIGHT (Rotate)</p>
      </div>
      <div className={styles.context}>
        <div className={styles.mapContainer} style={{ minWidth: gridWidthPx }}>
          <WorldMap width={mapSize.width} height={mapSize.height} cellSizePx={cellSizePx} />
          <Overlay mapWidth={mapSize.width} mapHeight={mapSize.height} cellSizePx={cellSizePx} />
        </div>
        <div className={styles.infopanel}>
          <InfoPanelContainer />
          <hr />
          <SettingsPanel
            commandDelay={commandDelay}
            mapSize={mapSize}
            onSetDelay={onSetDelay}
            onSetTextCommands={onSetTextCommands}
            onApplyMapSize={onApplyMapSize}
          />
        </div>
      </div>
    </div>
  )
}
