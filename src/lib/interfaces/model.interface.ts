import { Coordinate, CompassPoint } from 'oc-simple-robot/src/lib/models/types.model'

export interface FootprintData {
  occupierId: string
  coordinates: Coordinate[]
  direction?: CompassPoint
}
