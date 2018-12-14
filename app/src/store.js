// @flow

import thunk from 'redux-thunk'
import { createStore as createReduxStore, applyMiddleware, compose, combineReducers } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { loadTranslations, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { createPath } from 'history/PathUtils'

import isProduction from './marketplace/utils/isProduction'
import productsReducer from './marketplace/modules/productList/reducer'
import myProductsReducer from './marketplace/modules/myProductList/reducer'
import myPurchasesReducer from './marketplace/modules/myPurchaseList/reducer'
import productReducer from './marketplace/modules/product/reducer'
import contractProductReducer from './marketplace/modules/contractProduct/reducer'
import categoriesReducer from './marketplace/modules/categories/reducer'
import entitiesReducer from '$shared/modules/entities/reducer'
import userReducer from '$shared/modules/user/reducer'
import purchaseDialogReducer from './marketplace/modules/purchaseDialog/reducer'
import publishDialogReducer from './marketplace/modules/publishDialog/reducer'
import purchaseReducer from './marketplace/modules/purchase/reducer'
import saveProductReducer from './marketplace/modules/saveProductDialog/reducer'
import publishReducer from './marketplace/modules/publish/reducer'
import unpublishReducer from './marketplace/modules/unpublish/reducer'
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
import userpagesReducers from './userpages/reducers'

import translations from './marketplace/i18n'

const createRootReducer = (history) => combineReducers({
    allowance: allowanceReducer,
    categories: categoriesReducer,
    contractProduct: contractProductReducer,
    createContractProduct: createContractProductReducer,
    editProduct: editProductReducer,
    entities: entitiesReducer,
    global: globalReducer,
    i18n: i18nReducer,
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
    relatedProducts: relatedProductsReducer,
    router: connectRouter(history),
    saveProductDialog: saveProductReducer,
    streams: streamsReducer,
    transactions: transactionsReducer,
    unpublish: unpublishReducer,
    updateContractProduct: updateContractProductReducer,
    user: userReducer,
    web3: web3Reducer,
    // TODO: RE-ENABLE THESE WHEN USERPAGES ARE READY
    // userpages
    ...userpagesReducers,
})

const basePath = process.env.PLATFORM_BASE_PATH || '/'

const createMemoryHistoryWithBasename = (initialEntry: string, basename: string) => {
    const memHistory = createMemoryHistory({
        initialEntries: [initialEntry],
    })

    memHistory.createHref = (location) => `${basename}/${createPath(location)}`
    return memHistory
}

const createStore = (url: string = basePath) => {
    // Create a history depending on the environment
    const history = process.env.IS_BROWSER ? (
        createBrowserHistory({
            basename: process.env.PLATFORM_BASE_PATH,
        })
    ) : (
        createMemoryHistoryWithBasename(url, process.env.PLATFORM_BASE_PATH)
    )

    const enhancers = []

    // Dev tools are helpful
    if (!isProduction() && process.env.IS_BROWSER) {
        const { devToolsExtension } = window

        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension())
        }
    }

    const middleware = [thunk, routerMiddleware(history)]

    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers,
    )

    // Do we have preloaded state available? Great, save it.
    const initialState = (process.env.IS_BROWSER && window.__PRELOADED_STATE__) || {} // eslint-disable-line no-underscore-dangle

    // Delete it once we have it stored in a variable
    if (process.env.IS_BROWSER) {
        delete window.__PRELOADED_STATE__ // eslint-disable-line no-underscore-dangle
    }

    // Create the store
    const store = createReduxStore(
        createRootReducer(history),
        initialState,
        composedEnhancers,
    )

    syncTranslationWithStore(store)
    store.dispatch(loadTranslations(translations))

    return {
        store,
        history,
    }
}

export default createStore
