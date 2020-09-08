import styles from '../styles/cell.module.sass'

interface CellProps {
  key: string
  occupierId?: string
}

export default function Cell(props: CellProps) {
  const { occupierId } = props

  return <span data-occupier-id={occupierId} className={`${styles.cell} ${occupierId ? styles.occupied : ''}`}></span>
}
