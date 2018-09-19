// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from '@streamr/streamr-layout'

import isProduction from './marketplace/src/utils/isProduction'
import productsReducer from './marketplace/src/modules/productList/reducer'
import myProductsReducer from './marketplace/src/modules/myProductList/reducer'
import myPurchasesReducer from './marketplace/src/modules/myPurchaseList/reducer'
import productReducer from './marketplace/src/modules/product/reducer'
import contractProductReducer from './marketplace/src/modules/contractProduct/reducer'
import categoriesReducer from './marketplace/src/modules/categories/reducer'
import entitiesReducer from './marketplace/src/modules/entities/reducer'
import userReducer from './marketplace/src/modules/user/reducer'
import purchaseDialogReducer from './marketplace/src/modules/purchaseDialog/reducer'
import publishDialogReducer from './marketplace/src/modules/publishDialog/reducer'
import purchaseReducer from './marketplace/src/modules/purchase/reducer'
import publishReducer from './marketplace/src/modules/publish/reducer'
import createContractProductReducer from './marketplace/src/modules/createContractProduct/reducer'
import updateContractProductReducer from './marketplace/src/modules/updateContractProduct/reducer'
import allowanceReducer from './marketplace/src/modules/allowance/reducer'
import streamsReducer from './marketplace/src/modules/streams/reducer'
import editProductReducer from './marketplace/src/modules/editProduct/reducer'
import web3Reducer from './marketplace/src/modules/web3/reducer'
import modalsReducer from './marketplace/src/modules/modals/reducer'
import notificationsReducer from './marketplace/src/modules/notifications/reducer'
import globalReducer from './marketplace/src/modules/global/reducer'
import relatedProductsReducer from './marketplace/src/modules/relatedProducts/reducer'
import transactionsReducer from './marketplace/src/modules/transactions/reducer'
import history from './history'
import translations from './marketplace/src/i18n/index'

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
