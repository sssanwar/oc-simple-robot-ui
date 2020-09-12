import { connect } from 'react-redux'
import InfoPanel from './infopanel'
import { AppState } from '../store/app.slice'

const mapState = (state: AppState) => ({
  selectedRobot: state.robotLocations.find(r => r.id === state.selectedRobotId)
})

export default connect(mapState)(InfoPanel)
