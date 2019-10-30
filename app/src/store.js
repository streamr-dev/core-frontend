// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n'

import isProduction from './marketplace/utils/isProduction'
import productsReducer from './marketplace/modules/productList/reducer'
import myProductsReducer from './marketplace/modules/myProductList/reducer'
import myPurchasesReducer from './marketplace/modules/myPurchaseList/reducer'
import productReducer from './marketplace/modules/product/reducer'
import contractProductReducer from './marketplace/modules/contractProduct/reducer'
import categoriesReducer from './marketplace/modules/categories/reducer'
import entitiesReducer from '$shared/modules/entities/reducer'
import userReducer from '$shared/modules/user/reducer'
import integrationKeyReducer from '$shared/modules/integrationKey/reducer'
import resourceKeyReducer from '$shared/modules/resourceKey/reducer'
import purchaseDialogReducer from './marketplace/modules/deprecated/purchaseDialog/reducer'
import publishDialogReducer from './marketplace/modules/deprecated/publishDialog/reducer'
import purchaseReducer from './marketplace/modules/purchase/reducer'
import saveProductReducer from './marketplace/modules/deprecated/saveProductDialog/reducer'
import publishReducer from './marketplace/modules/publish/reducer'
import unpublishReducer from './marketplace/modules/unpublish/reducer'
import createContractProductReducer from './marketplace/modules/createContractProduct/reducer'
import updateContractProductReducer from './marketplace/modules/updateContractProduct/reducer'
import allowanceReducer from './marketplace/modules/allowance/reducer'
import streamsReducer from './marketplace/modules/streams/reducer'
import editProductReducer from './marketplace/modules/deprecated/editProduct/reducer'
import web3Reducer from './marketplace/modules/web3/reducer'
import globalReducer from './marketplace/modules/global/reducer'
import relatedProductsReducer from './marketplace/modules/relatedProducts/reducer'
import transactionsReducer from './marketplace/modules/transactions/reducer'
import userpagesReducers from './userpages/reducers'

import history from './history'
import analytics from './analytics'
import translations from './marketplace/i18n'

const middleware = [thunk, routerMiddleware(history), ...analytics.getMiddlewares()]
const toBeComposed = [applyMiddleware(...middleware)]

if (!isProduction()) {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
    /* eslint-enable no-underscore-dangle */
}

export function initStore() {
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
            myProductList: myProductsReducer,
            myPurchaseList: myPurchasesReducer,
            product: productReducer,
            productList: productsReducer,
            publish: publishReducer,
            unpublish: unpublishReducer,
            publishDialog: publishDialogReducer,
            purchase: purchaseReducer,
            purchaseDialog: purchaseDialogReducer,
            saveProductDialog: saveProductReducer,
            router: connectRouter(history),
            streams: streamsReducer,
            user: userReducer,
            integrationKey: integrationKeyReducer,
            resourceKey: resourceKeyReducer,
            web3: web3Reducer,
            i18n: i18nReducer,
            relatedProducts: relatedProductsReducer,
            transactions: transactionsReducer,
            // TODO: RE-ENABLE THESE WHEN USERPAGES ARE READY
            // userpages
            ...userpagesReducers,
        }),
        compose(...toBeComposed),
    )

    syncTranslationWithStore(store)

    store.dispatch(loadTranslations(translations))
    return store
}

export default initStore()
