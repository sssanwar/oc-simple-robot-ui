import styles from '../styles/worldmap.module.sass'
import React from 'react'

interface WorldMapProps {
  width: number
  height: number
  cellSizePx: number
}

function WorldMap(props: WorldMapProps) {
  const { width, height, cellSizePx } = props

  return (
    <div
      className={styles.mapGrid}
      style={{
        width: cellSizePx * width,
        height: cellSizePx * height,
        gridTemplateColumns: `repeat(${height}, 1fr)`,
        gridTemplateRows: `repeat(${width}, 1fr)`
      }}>
      {new Array(width)
        .fill(null)
        .map((_, x) =>
          new Array(height)
            .fill(null)
            .map((_, y) => (
              <span className={styles.cell} key={`${x}-${y}`} style={{ width: cellSizePx, height: cellSizePx }} />
            ))
        )}
    </div>
  )
}

export default React.memo(WorldMap)
