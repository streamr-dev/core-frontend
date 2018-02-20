// @flow

import ownWeb3 from '../web3/web3Instance'
import type {Address} from '../flowtype/web3-types'

const config = require('../../config')

export const CLICK_TRANSACTION_CREATE_REQUEST = 'CLICK_TRANSACTION_CREATE_REQUEST'
export const CLICK_TRANSACTION_CREATE_SUCCESS = 'CLICK_TRANSACTION_CREATE_SUCCESS'
export const CLICK_TRANSACTION_CREATE_FAILURE = 'CLICK_TRANSACTION_CREATE_FAILURE'
export const CLICK_TRANSACTION_EXECUTE_SUCCESS = 'CLICK_TRANSACTION_EXECUTE_SUCCESS'
export const CLICK_TRANSACTION_EXECUTE_FAILURE = 'CLICK_TRANSACTION_EXECUTE_FAILURE'

export const RESET_CLICK_COUNT_TRANSACTION_CREATE_REQUEST = 'RESET_CLICK_COUNT_TRANSACTION_CREATE_REQUEST'
export const RESET_CLICK_COUNT_TRANSACTION_CREATE_SUCCESS = 'RESET_CLICK_COUNT_TRANSACTION_CREATE_SUCCESS'
export const RESET_CLICK_COUNT_TRANSACTION_CREATE_FAILURE = 'RESET_CLICK_COUNT_TRANSACTION_CREATE_FAILURE'
export const RESET_CLICK_COUNT_TRANSACTION_EXECUTE_SUCCESS = 'RESET_CLICK_COUNT_TRANSACTION_EXECUTE_SUCCESS'
export const RESET_CLICK_COUNT_TRANSACTION_EXECUTE_FAILURE = 'RESET_CLICK_COUNT_TRANSACTION_EXECUTE_FAILURE'

export const GET_CLICK_COUNT_REQUEST = 'GET_CLICK_COUNT_REQUEST'
export const GET_CLICK_COUNT_SUCCESS = 'GET_CLICK_COUNT_SUCCESS'
export const GET_CLICK_COUNT_FAILURE = 'GET_CLICK_COUNT_FAILURE'

export const TEST_WEB3_BROWSER = 'TEST_WEB3_BROWSER'
export const TEST_NETWORK = 'TEST_NETWORK'

const contract = ownWeb3 && ownWeb3.eth.contract(config.smartContracts.clickCounter.abi).at(config.smartContracts.clickCounter.address)

const getCurrentAccount = () => ownWeb3 && ownWeb3.eth.accounts[0]

export const testWeb3Browser = () => ({
    type: TEST_WEB3_BROWSER,
    web3Enabled: typeof ownWeb3 !== 'undefined'
})

export const testNetwork = () => {
    const networkId = ownWeb3 && ownWeb3.version.network
    const getNetworkName = (networkId) => {
        switch (networkId) {
            case '1':
                return 'Main'
            case '2':
                return 'Morden'
            case '3':
                return 'Ropsten'
            case '4':
                return 'Rinkeby'
            case '42':
                return 'Kovan'
            case null:
                return null
            default:
                return 'Unknown'
        }
    }
    return {
        type: TEST_NETWORK,
        network: networkId ? {
            id: networkId,
            name: getNetworkName(networkId)
        } : null
    }
}

export const click = () => (dispatch: Function) => {
    if (contract) {
        dispatch(getClickCountRequest())
        contract.Click({
            from: getCurrentAccount()
        }).then((err, result) => {
            console.log('Called!')
            console.log(result)
        })
    }
}

export const resetClicks = () => (dispatch: Function) => {

}

export const getClickCount = () => (dispatch: Function) => {
    if (contract) {
        dispatch(getClickCountRequest())
        contract.GetMyClickCount({
            from: getCurrentAccount()
        }, (err, result) => {
            if (err) {
                dispatch(getClickCountFailure(err.toString()))
            } else {
                dispatch(getClickCountSuccess(parseFloat(result)))
            }
        })
    }
}

const clickTransactionCreateRequest = () => ({
    type: CLICK_TRANSACTION_CREATE_REQUEST
})

const clickTransactionCreateSuccess = (address: Address) => ({
    type: CLICK_TRANSACTION_CREATE_SUCCESS,
    address
})

const clickTransactionCreateFailure = (error: any) => ({
    type: CLICK_TRANSACTION_CREATE_FAILURE,
    error
})

const clickTransactionExecuteSuccess = (count: number) => ({
    type: CLICK_TRANSACTION_EXECUTE_SUCCESS,
    count
})

const clickTransactionExecuteFailure = (address: Address, error: any) => ({
    type: CLICK_TRANSACTION_EXECUTE_FAILURE,
    address,
    error
})

const getClickCountRequest = () => ({
    type: GET_CLICK_COUNT_REQUEST
})

const getClickCountSuccess = (count: number) => ({
    type: GET_CLICK_COUNT_SUCCESS,
    count
})

const getClickCountFailure = (error: any) => ({
    type: GET_CLICK_COUNT_FAILURE,
    error
})
