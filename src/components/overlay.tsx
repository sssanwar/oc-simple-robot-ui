import styles from '../styles/overlay.module.sass'
import OccupiersContainer from './occupiers.container'
import React from 'react'

interface OverlayProps {
  mapWidth: number
  mapHeight: number
  cellSizePx: number
}

function Overlay(props: OverlayProps) {
  const { mapWidth, mapHeight, cellSizePx: cellSizePx } = props

  return (
    <div
      className={styles.overlayContainer}
      style={{
        width: mapWidth * cellSizePx,
        height: mapHeight * cellSizePx,
        gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
        gridTemplateRows: `repeat(${mapHeight}, 1fr)`
      }}>
      <OccupiersContainer />
    </div>
  )
}

export default React.memo(Overlay)
