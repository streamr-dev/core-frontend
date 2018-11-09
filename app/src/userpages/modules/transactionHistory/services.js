// @flow

import { I18n } from 'react-redux-i18n'
import abiDecoder from 'abi-decoder'

import { transactionTypes } from '$shared/utils/constants'
import { getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { HashList, TransactionEntityList, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import TransactionError from '$shared/errors/TransactionError'
import { getUnprefixedHexString } from '$mp/utils/smartContract'

const getInputValues = (type, input) => {
    const inputValues = abiDecoder.decodeMethod(input)

    switch (type) {
        case 'Subscribed':
            return {
                type: transactionTypes.PURCHASE,
                value: inputValues.params[1].value,
            }

        case 'ProductCreated':
            return {
                type: transactionTypes.CREATE_CONTRACT_PRODUCT,
                value: 0,
            }

        case 'ProductUpdated':
            return {
                type: transactionTypes.UPDATE_CONTRACT_PRODUCT,
                value: 0,
            }

        case 'ProductDeleted':
            return {
                type: transactionTypes.UNDEPLOY_PRODUCT,
                value: 0,
            }

        case 'ProductRedeployed':
            return {
                type: transactionTypes.REDEPLOY_PRODUCT,
                value: 0,
            }

        default:
            return {}
    }
}

const getProductId = (type, returnValues) => {
    switch (type) {
        case 'Subscribed':
            return getUnprefixedHexString(returnValues[0]).toLowerCase()

        case 'ProductCreated':
        case 'ProductUpdated':
        case 'ProductDeleted':
        case 'ProductRedeployed':
            return getUnprefixedHexString(returnValues[1]).toLowerCase()

        default:
            return null
    }
}

export const getTransactionEvents = (addresses: HashList): Promise<EventLogList> => {
    const web3 = getPublicWeb3()
    const config = getConfig().marketplace
    const marketPlaceContract = new web3.eth.Contract(config.abi, config.address)
    abiDecoder.addABI(config.abi)

    const rawEvents = []

    // Get past events by filtering with the indexed address parameter.
    const eventNames = [{
        name: 'Subscribed', filter: 'subscriber',
    }, {
        name: 'ProductCreated', filter: 'owner',
    }, {
        name: 'ProductUpdated', filter: 'owner',
    }, {
        name: 'ProductDeleted', filter: 'owner',
    }, {
        name: 'ProductRedeployed', filter: 'owner',
    }]
    const eventPromises = eventNames.map(({ name, filter }) => marketPlaceContract.getPastEvents(name, {
        fromBlock: 1,
        filter: {
            [filter]: addresses,
        },
    }))

    // Get all events, add them to the same array and sort by block number
    return Promise.all(eventPromises)
        .then(([...eventLists]) => {
            eventLists.forEach((events) => {
                rawEvents.push(...events.map((event) => ({
                    transactionHash: event.transactionHash,
                    blockHash: event.blockHash,
                    blockNumber: event.blockNumber,
                    type: event.event,
                    productId: getProductId(event.event, event.returnValues),
                })))
            })

            return rawEvents.sort((a: any, b: any) => b.blockNumber - a.blockNumber)
        })
}

export const getTransactionsFromEvents = (events: EventLogList): Promise<TransactionEntityList> => {
    const web3 = getPublicWeb3()

    // Fetch transaction data for the given events
    return Promise.all(events.map((event: EventLog) => Promise.all([
        Promise.resolve(event),
        web3.eth.getTransaction(event.transactionHash),
        web3.eth.getTransactionReceipt(event.transactionHash),
        web3.eth.getBlock(event.blockHash),
    ])))
        .then(([...transactions]) =>
            transactions.map(([event, tx, receipt, block]) => ({
                id: tx.hash,
                state: 'completed',
                gasUsed: receipt.gasUsed,
                gasPrice: tx.gas,
                timestamp: block.timestamp,
                productId: event.productId,
                ...getInputValues(event.type, tx.input),
                ...((receipt.status === true) ? {
                    receipt,
                } : {
                    error: new TransactionError(I18n.t('error.txFailed'), receipt),
                }),
            })))
}
