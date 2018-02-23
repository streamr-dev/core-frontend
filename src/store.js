// @flow

import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'

import isProduction from './utils/isProduction'
import productReducer from './reducers/ProductReducer'
import categoryReducer from './reducers/CategoryReducer'

const middleware = [thunk]
const toBeComposed = [applyMiddleware(...middleware)]

if (!isProduction()) {
    if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
}

const store = createStore(
    combineReducers({
        product: productReducer,
        category: categoryReducer
    }),
    compose.apply(null, toBeComposed)
)

export default store
