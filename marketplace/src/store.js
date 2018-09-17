// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from '@streamr/streamr-layout'

import isProduction from './utils/isProduction'
import productsReducer from './modules/productList/reducer'
import myProductsReducer from './modules/myProductList/reducer'
import myPurchasesReducer from './modules/myPurchaseList/reducer'
import productReducer from './modules/product/reducer'
import contractProductReducer from './modules/contractProduct/reducer'
import categoriesReducer from './modules/categories/reducer'
import entitiesReducer from './modules/entities/reducer'
import userReducer from './modules/user/reducer'
import purchaseDialogReducer from './modules/purchaseDialog/reducer'
import publishDialogReducer from './modules/publishDialog/reducer'
import purchaseReducer from './modules/purchase/reducer'
import publishReducer from './modules/publish/reducer'
import createContractProductReducer from './modules/createContractProduct/reducer'
import updateContractProductReducer from './modules/updateContractProduct/reducer'
import allowanceReducer from './modules/allowance/reducer'
import streamsReducer from './modules/streams/reducer'
import editProductReducer from './modules/editProduct/reducer'
import web3Reducer from './modules/web3/reducer'
import modalsReducer from './modules/modals/reducer'
import notificationsReducer from './modules/notifications/reducer'
import globalReducer from './modules/global/reducer'
import relatedProductsReducer from './modules/relatedProducts/reducer'
import transactionsReducer from './modules/transactions/reducer'
import history from './history'
import translations from './i18n'

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
    }),
    compose(...toBeComposed),
)

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translations))

export default store
