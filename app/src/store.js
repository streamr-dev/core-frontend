// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n'

import isProduction from './marketplace/utils/isProduction'
import productsReducer from './marketplace/modules/productList/reducer'
import myProductsReducer from './marketplace/modules/myProductList/reducer'
import myPurchasesReducer from './marketplace/modules/myPurchaseList/reducer'
import productReducer from './marketplace/modules/product/reducer'
import contractProductReducer from './marketplace/modules/contractProduct/reducer'
import categoriesReducer from './marketplace/modules/categories/reducer'
import entitiesReducer from './marketplace/modules/entities/reducer'
import userReducer from './marketplace/modules/user/reducer'
import purchaseDialogReducer from './marketplace/modules/purchaseDialog/reducer'
import publishDialogReducer from './marketplace/modules/publishDialog/reducer'
import purchaseReducer from './marketplace/modules/purchase/reducer'
import publishReducer from './marketplace/modules/publish/reducer'
import createContractProductReducer from './marketplace/modules/createContractProduct/reducer'
import updateContractProductReducer from './marketplace/modules/updateContractProduct/reducer'
import allowanceReducer from './marketplace/modules/allowance/reducer'
import streamsReducer from './marketplace/modules/streams/reducer'
import editProductReducer from './marketplace/modules/editProduct/reducer'
import web3Reducer from './marketplace/modules/web3/reducer'
import modalsReducer from './marketplace/modules/modals/reducer'
import notificationsReducer from './marketplace/modules/notifications/reducer'
import globalReducer from './marketplace/modules/global/reducer'
import relatedProductsReducer from './marketplace/modules/relatedProducts/reducer'
import transactionsReducer from './marketplace/modules/transactions/reducer'

import dashboardReducer from './userpages/modules/dashboard/reducer'
import canvasReducer from './userpages/modules/canvas/reducer'
import permissionReducer from './userpages/modules/permission/reducer'
import integrationKeyReducer from './userpages/modules/integrationKey/reducer'
import streamReducer from './userpages/modules/stream/reducer'
import keyReducer from './userpages/modules/key/reducer'
import userpagesUserReducer from './userpages/modules/user/reducer'

import history from './history'
import translations from './marketplace/i18n'

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
        allowance: allowanceReducer,
        categories: categoriesReducer,
        contractProduct: contractProductReducer,
        createContractProduct: createContractProductReducer,
        updateContractProduct: updateContractProductReducer,
        editProduct: editProductReducer,
        entities: entitiesReducer,
        global: globalReducer,
        modals: modalsReducer,
        myProductList: myProductsReducer,
        myPurchaseList: myPurchasesReducer,
        notifications: notificationsReducer,
        product: productReducer,
        productList: productsReducer,
        publish: publishReducer,
        publishDialog: publishDialogReducer,
        purchase: purchaseReducer,
        purchaseDialog: purchaseDialogReducer,
        router: routerReducer,
        streams: streamsReducer,
        user: userReducer,
        web3: web3Reducer,
        i18n: i18nReducer,
        relatedProducts: relatedProductsReducer,
        transactions: transactionsReducer,
        // userpages
        dashboard: dashboardReducer,
        user2: userpagesUserReducer, // temporary
        integrationKey: integrationKeyReducer,
        canvas: canvasReducer,
        permission: permissionReducer,
        key: keyReducer,
        stream: streamReducer,
    }),
    compose(...toBeComposed),
)

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translations))

export default store
