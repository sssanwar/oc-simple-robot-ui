import { connect } from 'react-redux'
import Occupiers from './occupiers'
import { AppState } from '../store/app.slice'

const mapState = (state: AppState) => ({
  mapSize: state.mapSize,
  robotLocations: state.robotLocations
})

export default connect(mapState)(Occupiers)
