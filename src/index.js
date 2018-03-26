// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import store from './store'

const root = document.getElementById('root')

import {getProductFromContract, buyProduct} from './modules/product/services'
import getWeb3 from './web3/web3Provider'

//getWeb3().eth.getGasPrice()
//    .then(console.log)

//getProductFromContract('x')
//    .then(product => {
//        debugger
//    })

buyProduct('x', 1000)
    .on('transactionHash', (hash) => {
        debugger
    })
    .on('transactionComplete', (receipt) => {
        debugger
    })
    .on('error', (e) => {
        debugger
    })

window.web3 = getWeb3()

//if (root) {
//    render(
//        <Provider store={store}>
//            <App />
//        </Provider>,
//        root
//    )
//} else {
//    throw new Error('Root element could not be found.')
//}
