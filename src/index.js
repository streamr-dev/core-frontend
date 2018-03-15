// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import store from './store'

const root = document.getElementById('root')

import {getPriceFromContract, buyProduct} from './modules/product/services'

//buyProduct('x', 1000)
//    .onTransactionHash((hash) => {
//        debugger
//    })
//    .onComplete((receipt) => {
//        debugger
//    })

if (root) {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        root
    )
} else {
    throw new Error('Root element could not be found.')
}
