import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { MapSize } from '../lib/interfaces'
import { RobotLocationData } from 'oc-simple-robot/src/lib/models/types.model'

export interface AppState {
  textCommands: string
  commandDelay: number
  mapSize: MapSize
  gridWidthPx: number
  selectedRobotId?: string
  robotLocations: RobotLocationData[]
}

const initialState: AppState = {
  textCommands: '',
  commandDelay: 0,
  gridWidthPx: 600,
  mapSize: { width: 10, height: 10 },
  selectedRobotId: undefined,
  robotLocations: []
}

const appSlice = createSlice<AppState, SliceCaseReducers<AppState>, string>({
  name: 'appSlice',
  initialState,
  reducers: {
    setSelectedRobotId: (state, action: PayloadAction<string>) => {
      state.selectedRobotId = action.payload
    },
    updateRobotLocation: (state, action: PayloadAction<RobotLocationData>) => {
      const otherLocations = state.robotLocations.filter(r => r.id !== action.payload.id)
      otherLocations.push(action.payload)
      state.robotLocations = otherLocations
      state.selectedRobotId = action.payload.id
    },
    setMapSize: (state, action: PayloadAction<MapSize>) => {
      state.mapSize = action.payload
    },
    setTextCommands: (state, action: PayloadAction<string>) => {
      state.textCommands = action.payload
    },
    setDelay: (state, action: PayloadAction<number>) => {
      state.commandDelay = action.payload
    },
    clearTextCommands: state => {
      state.textCommands = ''
    },
    resetRobotData: state => {
      state.selectedRobotId = undefined
      state.robotLocations = []
    }
  }
})

export const {
  setSelectedRobotId,
  updateRobotLocation,
  setMapSize,
  setTextCommands,
  setDelay,
  clearTextCommands,
  resetRobotData
} = appSlice.actions

export default appSlice.reducer
