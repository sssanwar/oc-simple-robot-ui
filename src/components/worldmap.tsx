import styles from '../styles/worldmap.module.sass'

interface WorldMapProps {
  width: number
  height: number
  cellDiameterPx: number
}

export default function WorldMap(props: WorldMapProps) {
  const { width, height, cellDiameterPx } = props

  return (
    <div
      className={styles.mapGrid}
      style={{
        width: cellDiameterPx * width,
        height: cellDiameterPx * height,
        gridTemplateColumns: `repeat(${height}, 1fr)`,
        gridTemplateRows: `repeat(${width}, 1fr)`
      }}>
      {new Array(width)
        .fill(null)
        .map((_, x) =>
          new Array(height)
            .fill(null)
            .map((_, y) => (
              <span
                className={styles.cell}
                key={`${x}-${y}`}
                style={{ width: cellDiameterPx, height: cellDiameterPx }}
              />
            ))
        )}
    </div>
  )
}
