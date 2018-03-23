// @flow

import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import isProduction from './utils/isProduction'
import productsReducer from './modules/productList/reducer'
import productReducer from './modules/product/reducer'
import categoriesReducer from './modules/categories/reducer'
import entitiesReducer from './modules/entities/reducer'
import userReducer from './modules/user/reducer'
import uiReducer from './modules/ui/reducer'
import streamsReducer from './modules/streams/reducer'
import createProductReducer from './modules/createProduct/reducer'
import history from './history'

const middleware = [thunk, routerMiddleware(history)]
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
        user: userReducer,
        ui: uiReducer,
        streams: streamsReducer,
        createProduct: createProductReducer,
        router: routerReducer,
    }),
    compose.apply(null, toBeComposed)
)

export default store
