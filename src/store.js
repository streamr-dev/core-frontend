// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import isProduction from './utils/isProduction'
import productsReducer from './modules/productList/reducer'
import productReducer from './modules/product/reducer'
import categoriesReducer from './modules/categories/reducer'
import entitiesReducer from './modules/entities/reducer'
import userReducer from './modules/user/reducer'
import streamsReducer from './modules/streams/reducer'
import createProductReducer from './modules/createProduct/reducer'
import web3Reducer from './modules/web3/reducer'
import modalsReducer from './modules/modals/reducer'
import history from './history'

const middleware = [thunk, routerMiddleware(history)]
const toBeComposed = [applyMiddleware(...middleware)]

if (!isProduction()) {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
    /* eslint-enable no-underscore-dangle */
}

const store = createStore(
    combineReducers({
        productList: productsReducer,
        product: productReducer,
        categories: categoriesReducer,
        entities: entitiesReducer,
        user: userReducer,
        streams: streamsReducer,
        createProduct: createProductReducer,
        web3: web3Reducer,
        modals: modalsReducer,
        router: routerReducer,
    }),
    compose(...toBeComposed),
)

export default store
