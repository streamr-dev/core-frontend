import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers, Store } from 'redux'
import entitiesReducer from '$shared/modules/entities/reducer'
import dataUnionReducer from './marketplace/modules/dataUnion/reducer'
import analytics from './analytics'
const middleware = [thunk, ...analytics.getMiddlewares()]
const toBeComposed = [applyMiddleware(...middleware)]

/* eslint-disable no-underscore-dangle */
if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    toBeComposed.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

/* eslint-enable no-underscore-dangle */
export function initStore(): Store {
    const store = createStore(
        combineReducers({
            dataUnion: dataUnionReducer,
            entities: entitiesReducer,
        }),
        compose(...toBeComposed),
    )
    return store
}
export default initStore()
