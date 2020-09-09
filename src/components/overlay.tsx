import styles from '../styles/overlay.module.sass'
import { FootprintData } from '../lib/interfaces/model.interface'
import { useEffect, useState } from 'react'

interface OverlayProps {
  mapWidth: number
  mapHeight: number
  cellDiameterPx: number
  footprintData: FootprintData
}

export default function Overlay(props: OverlayProps) {
  const { mapWidth, mapHeight, cellDiameterPx, footprintData: fp } = props
  const [occpSize, setOccpSize] = useState({ x: 0, y: 0 })

  const calculateSize = (fp: FootprintData) => {
    const maxX = Math.max(...fp.coordinates.map(c => c.x))
    const maxY = Math.max(...fp.coordinates.map(c => c.y))
    const minX = Math.min(...fp.coordinates.map(c => c.x))
    const minY = Math.min(...fp.coordinates.map(c => c.y))
    return { x: maxX - minX + 1, y: maxY - minY + 1 }
  }

  useEffect(() => setOccpSize(calculateSize(fp)), [])

  return (
    <div
      data-occupier-id={fp.occupierId}
      className={styles.overlayContainer}
      style={{
        width: mapWidth * cellDiameterPx,
        height: mapHeight * cellDiameterPx,
        gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
        gridTemplateRows: `repeat(${mapHeight}, 1fr)`
      }}>
      <div
        className={styles.occupier}
        style={{
          transform: `rotate(${fp.direction}deg)`,
          gridArea: `${mapHeight - (fp.coordinates[0].y + occpSize.y - 1)} / ${fp.coordinates[0].x + occpSize.x}`
        }}
      />
    </div>
  )
}
