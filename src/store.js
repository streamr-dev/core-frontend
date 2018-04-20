// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import isProduction from './utils/isProduction'
import productsReducer from './modules/productList/reducer'
import myProductsReducer from './modules/myProductList/reducer'
import myPurchasesReducer from './modules/myPurchaseList/reducer'
import productReducer from './modules/product/reducer'
import categoriesReducer from './modules/categories/reducer'
import entitiesReducer from './modules/entities/reducer'
import userReducer from './modules/user/reducer'
import purchaseDialogReducer from './modules/purchaseDialog/reducer'
import publishDialogReducer from './modules/publishDialog/reducer'
import purchaseReducer from './modules/purchase/reducer'
import publishReducer from './modules/publish/reducer'
import createContractProductReducer from './modules/createContractProduct/reducer'
import allowanceReducer from './modules/allowance/reducer'
import streamsReducer from './modules/streams/reducer'
import createProductReducer from './modules/createProduct/reducer'
import editProductReducer from './modules/editProduct/reducer'
import web3Reducer from './modules/web3/reducer'
import modalsReducer from './modules/modals/reducer'
import notificationsReducer from './modules/notifications/reducer'
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
        myProductList: myProductsReducer,
        myPurchaseList: myPurchasesReducer,
        product: productReducer,
        categories: categoriesReducer,
        entities: entitiesReducer,
        user: userReducer,
        purchaseDialog: purchaseDialogReducer,
        publishDialog: publishDialogReducer,
        purchase: purchaseReducer,
        publish: publishReducer,
        createContractProduct: createContractProductReducer,
        streams: streamsReducer,
        createProduct: createProductReducer,
        editProduct: editProductReducer,
        web3: web3Reducer,
        allowance: allowanceReducer,
        modals: modalsReducer,
        notifications: notificationsReducer,
        router: routerReducer,
    }),
    compose(...toBeComposed),
)

export default store
