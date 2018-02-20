// @flow

import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'

import productReducer from './reducers/ProductReducer'
import categoryReducer from './reducers/CategoryReducer'
import web3TesterReducer from './reducers/Web3TesterReducer'

const middleware = [thunk]
let toBeComposed = [applyMiddleware(...middleware)]

if (process.env.NODE_ENV !== 'production') {
    if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
}

const store = createStore(
    combineReducers({
        product: productReducer,
        category: categoryReducer,
        web3: web3TesterReducer
    }),
    compose.apply(null, toBeComposed)
)

export default store
