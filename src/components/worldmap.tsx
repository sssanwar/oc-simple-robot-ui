import styles from '../styles/worldmap.module.sass'
import Cell from './cell'
import { FootprintData } from '../lib/interfaces/model.interface'

interface WorldMapProps {
  width: number
  height: number
  footprints: FootprintData[]
}

export default function WorldMap(props: WorldMapProps) {
  const { width, height, footprints } = props

  const getFootprintDataByPos = (x: number, y: number): FootprintData | undefined =>
    footprints.find(f => f.coordinates.find(c => c.x === x && c.y === y))

  return (
    <div className={styles.mapContainer}>
      <div
        className={styles.mapGrid}
        style={{ gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${width}, 1fr)` }}>
        {new Array(width)
          .fill(null)
          .map((_, x) =>
            new Array(height)
              .fill(null)
              .map((_, y) => <Cell key={`${x}-${y}`} occupierId={getFootprintDataByPos(x, y)?.occupierId} />)
          )}
      </div>
    </div>
  )
}
