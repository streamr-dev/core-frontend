// @flow

import getWeb3 from '../web3/web3Provider'
import type {Hash} from '../flowtype/web3-types'

const config = require('../../config')

export const CLICK_TRANSACTION_CREATE_REQUEST = 'CLICK_TRANSACTION_CREATE_REQUEST'
export const CLICK_TRANSACTION_CREATE_SUCCESS = 'CLICK_TRANSACTION_CREATE_SUCCESS'
export const CLICK_TRANSACTION_CREATE_FAILURE = 'CLICK_TRANSACTION_CREATE_FAILURE'
export const CLICK_TRANSACTION_EXECUTE_SUCCESS = 'CLICK_TRANSACTION_EXECUTE_SUCCESS'
export const CLICK_TRANSACTION_EXECUTE_FAILURE = 'CLICK_TRANSACTION_EXECUTE_FAILURE'

export const RESET_CLICKS_TRANSACTION_CREATE_REQUEST = 'RESET_CLICKS_TRANSACTION_CREATE_REQUEST'
export const RESET_CLICKS_TRANSACTION_CREATE_SUCCESS = 'RESET_CLICKS_TRANSACTION_CREATE_SUCCESS'
export const RESET_CLICKS_TRANSACTION_CREATE_FAILURE = 'RESET_CLICKS_TRANSACTION_CREATE_FAILURE'
export const RESET_CLICKS_TRANSACTION_EXECUTE_SUCCESS = 'RESET_CLICKS_TRANSACTION_EXECUTE_SUCCESS'
export const RESET_CLICKS_TRANSACTION_EXECUTE_FAILURE = 'RESET_CLICKS_TRANSACTION_EXECUTE_FAILURE'

export const GET_CLICK_COUNT_REQUEST = 'GET_CLICK_COUNT_REQUEST'
export const GET_CLICK_COUNT_SUCCESS = 'GET_CLICK_COUNT_SUCCESS'
export const GET_CLICK_COUNT_FAILURE = 'GET_CLICK_COUNT_FAILURE'

export const TEST_WEB3_BROWSER = 'TEST_WEB3_BROWSER'
export const TEST_NETWORK = 'TEST_NETWORK'

const getContract = () => new Promise(resolve => {
    const ownWeb3 = getWeb3()
    ownWeb3
        .getDefaultAccount()
        .then((account) => {
            resolve(ownWeb3.eth.Contract(config.smartContracts.clickCounter.abi, config.smartContracts.clickCounter.address, {
                from: account
            }))
        })
})

export const testWeb3Browser = () => (dispatch: Function) => {
    const ownWeb3 = getWeb3()
    ownWeb3.getDefaultAccount()
        .then(([address]) => {
            dispatch({
                type: TEST_WEB3_BROWSER,
                address
            })
        })
        .catch(() => {
            dispatch({
                type: TEST_WEB3_BROWSER,
                address: null
            })
        })
}

export const testNetwork = () => (dispatch: Function) => {
    const ownWeb3 = getWeb3()
    const getNetworkName = (networkId) => {
        switch (networkId) {
            case 1:
                return 'Main'
            case 2:
                return 'Morden'
            case 3:
                return 'Ropsten'
            case 4:
                return 'Rinkeby'
            case 42:
                return 'Kovan'
            default:
                return 'Unknown'
        }
    }
    ownWeb3.eth.net.getId()
        .then((id) => {
            dispatch({
                type: TEST_NETWORK,
                network: id ? {
                    id,
                    name: getNetworkName(id)
                } : null
            })
        })
}

export const click = () => (dispatch: Function) => {
    let txHash
    getContract()
        .then((contract) => {
            dispatch(clickTransactionCreateRequest())
            contract.methods.Click().send()
                .on('transactionHash', (hash) => {
                    txHash = hash
                    dispatch(clickTransactionCreateSuccess(hash))
                })
                .then(({transactionHash}: {transactionHash: Hash}) => {
                    dispatch(clickTransactionExecuteSuccess(transactionHash))
                    dispatch(getClickCount())
                })
                .catch((error) => {
                    throw error
                })
        })
        .catch((error) => {
            if (txHash) {
                dispatch(clickTransactionExecuteFailure(txHash, error))
            } else {
                dispatch(clickTransactionCreateFailure(error))
            }
        })
}

export const resetClicks = () => (dispatch: Function) => {
    let txHash
    getContract()
        .then((contract) => {
            dispatch(resetClicksTransactionCreateRequest())
            contract.methods.ResetMyClicks().send()
                .on('transactionHash', (hash) => {
                    txHash = hash
                    dispatch(resetClicksTransactionCreateSuccess(hash))
                })
                .then(({transactionHash}: {transactionHash: Hash}) => {
                    dispatch(resetClicksTransactionExecuteSuccess(transactionHash))
                })
                .catch((error) => {
                    if (txHash) {
                        dispatch(resetClicksTransactionExecuteFailure(txHash, error))
                    } else {
                        dispatch(resetClicksTransactionCreateFailure(error))
                    }
                })
        })
}

export const getClickCount = () => (dispatch: Function) => {
    getContract()
        .then((contract) => {
            dispatch(getClickCountRequest())
            contract.methods.GetMyClickCount().call()
                .then((count) => dispatch(getClickCountSuccess(parseFloat(count))))
                .catch((err) => dispatch(getClickCountFailure(err.toString())))
        })
}

const clickTransactionCreateRequest = () => ({
    type: CLICK_TRANSACTION_CREATE_REQUEST
})

const clickTransactionCreateSuccess = (hash: Hash) => ({
    type: CLICK_TRANSACTION_CREATE_SUCCESS,
    hash
})

const clickTransactionCreateFailure = (error: any) => ({
    type: CLICK_TRANSACTION_CREATE_FAILURE,
    error
})

const clickTransactionExecuteSuccess = (hash: Hash) => ({
    type: CLICK_TRANSACTION_EXECUTE_SUCCESS,
    hash
})

const clickTransactionExecuteFailure = (hash: Hash, error: any) => ({
    type: CLICK_TRANSACTION_EXECUTE_FAILURE,
    hash,
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

const resetClicksTransactionCreateRequest = () => ({
    type: RESET_CLICKS_TRANSACTION_CREATE_REQUEST
})

const resetClicksTransactionCreateSuccess = (hash: Hash) => ({
    type: RESET_CLICKS_TRANSACTION_CREATE_SUCCESS,
    hash
})

const resetClicksTransactionCreateFailure = (error: any) => ({
    type: RESET_CLICKS_TRANSACTION_CREATE_FAILURE,
    error
})

const resetClicksTransactionExecuteSuccess = (hash: Hash) => ({
    type: RESET_CLICKS_TRANSACTION_EXECUTE_SUCCESS,
    hash
})

const resetClicksTransactionExecuteFailure = (hash: Hash, error: any) => ({
    type: RESET_CLICKS_TRANSACTION_EXECUTE_FAILURE,
    hash,
    error
})
