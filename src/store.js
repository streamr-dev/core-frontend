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
import purchaseDialogReducer from './modules/purchaseDialog/reducer'
import publishDialogReducer from './modules/publishDialog/reducer'
import purchaseReducer from './modules/purchase/reducer'
import allowanceReducer from './modules/allowance/reducer'
import streamsReducer from './modules/streams/reducer'
import createProductReducer from './modules/createProduct/reducer'
import editProductReducer from './modules/editProduct/reducer'
import web3Reducer from './modules/web3/reducer'
import modalsReducer from './modules/modals/reducer'
import globalReducer from './modules/global/reducer'
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
        purchaseDialog: purchaseDialogReducer,
        publishDialog: publishDialogReducer,
        purchase: purchaseReducer,
        streams: streamsReducer,
        createProduct: createProductReducer,
        editProduct: editProductReducer,
        web3: web3Reducer,
        allowance: allowanceReducer,
        modals: modalsReducer,
        global: globalReducer,
        router: routerReducer,
    }),
    compose(...toBeComposed),
)

export default store
