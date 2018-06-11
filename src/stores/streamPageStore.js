// @flow

import createStore from './basicStore'

import streamReducer from '../reducers/stream'
import permissionReducer from '../reducers/permission'
import keyReducer from '../reducers/key'

export default createStore({
    stream: streamReducer,
    permission: permissionReducer,
    key: keyReducer
})
