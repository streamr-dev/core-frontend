// @flow

import dashboardReducer from '../reducers/dashboard'
import canvasReducer from '../reducers/canvas'
import permissionReducer from '../reducers/permission'
import integrationKeyReducer from '../reducers/integrationKey'
import streamReducer from '../reducers/stream'
import keyReducer from '../reducers/key'

import createStore from './createStore'

export default createStore({
    dashboard: dashboardReducer,
    canvas: canvasReducer,
    permission: permissionReducer,
    integrationKey: integrationKeyReducer,
    key: keyReducer,
    stream: streamReducer,
})
