import { connect } from 'react-redux'
import {
  AppState,
  updateRobotLocation,
  resetRobotData,
  clearTextCommands,
  setDelay,
  setTextCommands,
  setMapSize
} from '../store/app.slice'
import HomeView from './home.view'
import { RobotLocationData } from 'oc-simple-robot/src/lib/models/types.model'
import { MapSize } from '../lib/interfaces'

const mapState = (state: AppState) => ({
  selectedRobotId: state.selectedRobotId,
  textCommands: state.textCommands,
  commandDelay: state.commandDelay,
  gridWidthPx: state.gridWidthPx,
  mapSize: state.mapSize
})

const mapDispatch = (dispatch: any) => ({
  onSetDelay: (delay: number) => dispatch(setDelay(delay)),
  onSetTextCommands: (cmds: string) => dispatch(setTextCommands(cmds)),
  onApplyMapSize: (mapSize: MapSize) => dispatch(setMapSize(mapSize)),
  onUpdateRobotLocation: (data: RobotLocationData) => dispatch(updateRobotLocation(data)),
  onClearTextCommands: () => dispatch(clearTextCommands(void 0)),
  onResetRobotData: () => dispatch(resetRobotData(void 0))
})

export default connect(mapState, mapDispatch)(HomeView)
