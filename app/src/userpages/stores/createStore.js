// @flow

import thunk from 'redux-thunk'

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { reducer as notificationReducer } from 'react-notification-system-redux'

export default (reducers: {}) => {
    const middleware = [thunk]
    const toBeComposed = [applyMiddleware(...middleware)]

    if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-underscore-dangle */
        if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
            toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
        }
        /* eslint-enable no-underscore-dangle */
    }

    return createStore(
        combineReducers({
            notifications: notificationReducer,
            ...reducers,
        }),
        compose(...toBeComposed),
    )
}
