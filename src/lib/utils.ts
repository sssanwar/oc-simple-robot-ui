import { RobotLocationData } from 'oc-simple-robot/src/lib/models/types.model'

export const calculateSize = (locationData: RobotLocationData) => {
  const maxX = Math.max(...locationData.footprints.map(c => c.x))
  const maxY = Math.max(...locationData.footprints.map(c => c.y))
  const minX = Math.min(...locationData.footprints.map(c => c.x))
  const minY = Math.min(...locationData.footprints.map(c => c.y))
  return { xLength: maxX - minX + 1, yLength: maxY - minY + 1 }
}
