// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n'

import productsReducer from './marketplace/modules/productList/reducer'
import myProductsReducer from './marketplace/modules/myProductList/reducer'
import myPurchasesReducer from './marketplace/modules/myPurchaseList/reducer'
import productReducer from './marketplace/modules/product/reducer'
import contractProductReducer from './marketplace/modules/contractProduct/reducer'
import dataUnionReducer from './marketplace/modules/dataUnion/reducer'
import categoriesReducer from './marketplace/modules/categories/reducer'
import entitiesReducer from '$shared/modules/entities/reducer'
import userReducer from '$shared/modules/user/reducer'
import integrationKeyReducer from '$shared/modules/integrationKey/reducer'
import streamsReducer from './marketplace/modules/streams/reducer'
import globalReducer from './marketplace/modules/global/reducer'
import relatedProductsReducer from './marketplace/modules/relatedProducts/reducer'
import transactionsReducer from './marketplace/modules/transactions/reducer'
import userpagesReducers from './userpages/reducers'

import history from './history'
import analytics from './analytics'
import translations from './marketplace/i18n'

const middleware = [thunk, routerMiddleware(history), ...analytics.getMiddlewares()]
const toBeComposed = [applyMiddleware(...middleware)]

/* eslint-disable no-underscore-dangle */
if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
/* eslint-enable no-underscore-dangle */

export function initStore() {
    const store = createStore(
        combineReducers({
            categories: categoriesReducer,
            contractProduct: contractProductReducer,
            dataUnion: dataUnionReducer,
            entities: entitiesReducer,
            global: globalReducer,
            myProductList: myProductsReducer,
            myPurchaseList: myPurchasesReducer,
            product: productReducer,
            productList: productsReducer,
            router: connectRouter(history),
            streams: streamsReducer,
            user: userReducer,
            integrationKey: integrationKeyReducer,
            i18n: i18nReducer,
            relatedProducts: relatedProductsReducer,
            transactions: transactionsReducer,
            ...userpagesReducers,
        }),
        compose(...toBeComposed),
    )

    syncTranslationWithStore(store)

    store.dispatch(loadTranslations(translations))
    return store
}

export default initStore()
