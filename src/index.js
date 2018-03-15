// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import store from './store'

const root = document.getElementById('root')

//import {getProductFromContract, buyProduct} from './modules/product/services'
//
//buyProduct('x', 1000, (hash) => {
//    debugger
//})
//    .then((receipt) => {
//        debugger
//    })
//    .catch(e => {
//        debugger
//    })
//getProductFromContract('x')
//    .then(product => {
//        debugger
//    })
//    .catch(e => {
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
