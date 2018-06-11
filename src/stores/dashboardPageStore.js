// @flow

import createStore from './basicStore'

import dashboardReducer from '../reducers/dashboard'
import canvasReducer from '../reducers/canvas'
import permissionReducer from '../reducers/permission'

export default createStore({
    dashboard: dashboardReducer,
    canvas: canvasReducer,
    permission: permissionReducer
})
