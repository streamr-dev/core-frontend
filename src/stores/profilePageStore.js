// @flow

import createStore from './basicStore'

import integrationKeyReducer from '../reducers/integrationKey'
import keyReducer from '../reducers/key'

export default createStore({
    integrationKey: integrationKeyReducer,
    key: keyReducer
})
