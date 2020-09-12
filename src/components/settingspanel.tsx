import styles from '../styles/infopanel.module.sass'
import { useState, ChangeEvent } from 'react'
import { MapSize } from '../lib/interfaces'

interface SettingsPanelProps {
  commandDelay: number
  mapSize: MapSize
  onSetDelay: (delay: number) => void
  onSetTextCommands: (input: string) => void
  onApplyMapSize: (mapSize: { width: number; height: number }) => void
}

export default function SettingsPanel(props: SettingsPanelProps) {
  const { commandDelay, mapSize, onSetTextCommands, onApplyMapSize, onSetDelay } = props
  const [mapSizeEntry, setMapSizeEntry] = useState({
    width: mapSize.width.toString(),
    height: mapSize.height.toString()
  })
  const [cmdDelay, setCmdDelay] = useState(commandDelay.toString())
  const [cmdString, setCmdString] = useState('M1RM4L3M2')
  const handleApply = () => {
    onSetDelay(Number(cmdDelay))
    onApplyMapSize({ width: Number(mapSizeEntry.width), height: Number(mapSizeEntry.height) })
  }
  const handleCmdInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) => setCmdString(ev.target.value)
  const handleSend = () => onSetTextCommands(cmdString)
  const handleMapSizeEntry = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setMapSizeEntry({ ...mapSizeEntry, [name]: e.target.value })
  }

  const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation()
  console.log('settings render')
  return (
    <div className={styles.infopanel}>
      <p>
        <label>Map Size: </label>
        <input
          type='text'
          value={mapSizeEntry.width}
          onKeyDown={stopPropagation}
          onChange={e => handleMapSizeEntry(e, 'width')}
        />
        x
        <input
          type='text'
          value={mapSizeEntry.height}
          onKeyDown={stopPropagation}
          onChange={e => handleMapSizeEntry(e, 'height')}
        />
      </p>
      <p>
        <label>Delay:</label>
        <input type='text' value={cmdDelay} onKeyDown={stopPropagation} onChange={e => setCmdDelay(e.target.value)} />
        <button onClick={handleApply}>Apply</button>
      </p>
      <label className={styles.inputCommand}>Input Commands ({commandDelay}ms delay):</label>
      <textarea cols={50} rows={10} value={cmdString} onKeyDown={stopPropagation} onChange={handleCmdInputChange} />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
