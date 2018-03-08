// @flow

import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'

import isProduction from './utils/isProduction'
import productsReducer from './modules/productList/reducer'
import productReducer from './modules/product/reducer'
import categoriesReducer from './modules/categories/reducer'
import entitiesReducer from './modules/entities/reducer'
import streamsReducer from './modules/streams/reducer'

const middleware = [thunk]
const toBeComposed = [applyMiddleware(...middleware)]

if (!isProduction()) {
    if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
}

const store = createStore(
    combineReducers({
        productList: productsReducer,
        product: productReducer,
        categories: categoriesReducer,
        entities: entitiesReducer,
        streams: streamsReducer,
    }),
    compose.apply(null, toBeComposed)
)

export default store
