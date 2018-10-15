// @flow

import dashboardReducer from '../modules/dashboard/reducer'
import canvasReducer from '../modules/canvas/reducer'
import permissionReducer from '../modules/permission/reducer'
import integrationKeyReducer from '../modules/integrationKey/reducer'
import userPageStreamsReducer from '../modules/userPageStreams/reducer'
import keyReducer from '../modules/key/reducer'

import createStore from './createStore'

export default createStore({
    dashboard: dashboardReducer,
    integrationKey: integrationKeyReducer,
    canvas: canvasReducer,
    permission: permissionReducer,
    key: keyReducer,
    userPageStreams: userPageStreamsReducer,
})
