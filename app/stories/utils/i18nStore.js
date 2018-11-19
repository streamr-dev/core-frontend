// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { loadTranslations, syncTranslationWithStore, i18nReducer, setLocale } from 'react-redux-i18n'

import translations from '$mp/i18n'

const middleware = [thunk]
const toBeComposed = [applyMiddleware(...middleware)]

/* eslint-disable no-underscore-dangle */
if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
/* eslint-enable no-underscore-dangle */

const store = createStore(
    combineReducers({
        i18n: i18nReducer,
    }),
    compose(...toBeComposed),
)

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translations))
store.dispatch(setLocale('en'))

export default store
