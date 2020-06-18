// @flow

import { I18n } from 'react-redux-i18n'
import abiDecoder from 'abi-decoder'

import { transactionTypes, paymentCurrencies } from '$shared/utils/constants'
import { getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { HashList, TransactionEntityList, TransactionEntity, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import TransactionError from '$shared/errors/TransactionError'
import type { ProductIdList } from '$mp/flowtype/product-types'

const eventTypeToTransactionType = {
    ProductCreated: transactionTypes.CREATE_CONTRACT_PRODUCT,
    ProductUpdated: transactionTypes.UPDATE_CONTRACT_PRODUCT,
    ProductDeleted: transactionTypes.UNDEPLOY_PRODUCT,
    ProductRedeployed: transactionTypes.REDEPLOY_PRODUCT,
}

const getPurchaseTokens = (logValues) => {
    let dataEvent
    let currencyEvent
    let paymentCurrency

    const transferEvents = (logValues && logValues.filter(({ name }) => name === 'Transfer')) || []

    // bit hacky but use the amount of events to determine the purchase currency
    // last transfer event will be the DATA amount
    switch (transferEvents.length) {
        // DATA
        case 1: {
            [dataEvent] = transferEvents

            break
        }

        // ETH
        case 2: {
            // TODO: approximate ETH from currencyEvent token amount
            // paymentCurrency = paymentCurrencies.ETH;
            // [currencyEvent, dataEvent] = transferEvents
            [, dataEvent] = transferEvents

            break
        }

        // DAI
        case 4: {
            paymentCurrency = paymentCurrencies.DAI;
            [currencyEvent, , , dataEvent] = transferEvents

            break
        }

        default:
            break
    }

    const { events: tokenTransferEvents } = dataEvent || {}
    const { events: currencyTransferEvents } = currencyEvent || {}
    const { value: tokens } = (tokenTransferEvents && tokenTransferEvents.find(({ name }) => name === 'tokens')) || {}
    const { value: paymentValue } = (currencyTransferEvents && currencyTransferEvents.find(({ name }) => name === 'tokens')) || {}

    return {
        tokens,
        paymentValue,
        paymentCurrency,
    }
}

const getInputValues = (type, logs) => {
    const logValues = (abiDecoder.decodeLogs(logs) || []).filter(Boolean)

    switch (type) {
        case 'PaymentReceived': {
            const { events: subscribedEvents } = logValues.find(({ name }) => name === 'Subscribed') || {}
            const { value: productId } = (subscribedEvents && subscribedEvents.find(({ name }) => name === 'productId')) || {}

            const { tokens, paymentValue, paymentCurrency } = getPurchaseTokens(logValues)

            return {
                productId,
                type: transactionTypes.PAYMENT,
                value: tokens,
                paymentValue,
                paymentCurrency,
            }
        }

        case 'PaymentSent': {
            const { events: subscribedEvents } = logValues.find(({ name }) => name === 'Subscribed') || {}
            const { value: productId } = (subscribedEvents && subscribedEvents.find(({ name }) => name === 'productId')) || {}

            const { tokens, paymentValue, paymentCurrency } = getPurchaseTokens(logValues)

            return {
                productId,
                type: transactionTypes.PURCHASE,
                value: tokens,
                paymentValue,
                paymentCurrency,
            }
        }

        case 'ProductCreated':
        case 'ProductUpdated':
        case 'ProductDeleted':
        case 'ProductRedeployed': {
            const { events } = logValues.find(({ name }) => name === type) || {}
            const { value: productId } = (events && events.find(({ name }) => name === 'id')) || {}

            return {
                productId,
                type: eventTypeToTransactionType[type],
                value: '0',
            }
        }

        default:
            return {}
    }
}

export const getTransactionEvents = (addresses: HashList, products: ProductIdList): Promise<EventLogList> => {
    const web3 = getPublicWeb3()
    const { marketplace, dataToken } = getConfig()

    // these are needed to decode log values
    abiDecoder.addABI(marketplace.abi)
    abiDecoder.addABI(dataToken.abi)

    const marketPlaceContract = new web3.eth.Contract(marketplace.abi, marketplace.address)
    const rawEvents = []

    // Get past events by filtering with the indexed address parameter.
    const eventNames = [{
        contract: marketPlaceContract, name: 'Subscribed', filter: { productId: products }, type: 'PaymentReceived',
    }, {
        contract: marketPlaceContract, name: 'Subscribed', filter: { subscriber: addresses }, type: 'PaymentSent',
    }, {
        contract: marketPlaceContract, name: 'ProductCreated', filter: { owner: addresses }, type: 'ProductCreated',
    }, {
        contract: marketPlaceContract, name: 'ProductUpdated', filter: { owner: addresses }, type: 'ProductUpdated',
    }, {
        contract: marketPlaceContract, name: 'ProductDeleted', filter: { owner: addresses }, type: 'ProductDeleted',
    }, {
        contract: marketPlaceContract, name: 'ProductRedeployed', filter: { owner: addresses }, type: 'ProductRedeployed',
    }]
    const eventTypes = eventNames.map(({ type }) => type)
    const eventPromises = eventNames.map(({ contract, name, filter }) => contract.getPastEvents(name, {
        fromBlock: 1,
        filter,
    }))
    const transactionCounts = {}

    // Get all events, add them to the same array and sort by block number
    return Promise.all(eventPromises)
        .then(([...eventLists]) => {
            eventLists.forEach((events, index) => {
                rawEvents.push(...events.map((event) => {
                    if (!transactionCounts[event.transactionHash]) {
                        transactionCounts[event.transactionHash] = 0
                    }
                    transactionCounts[event.transactionHash] += 1

                    return ({
                        id: `${event.transactionHash}-${transactionCounts[event.transactionHash]}`,
                        transactionHash: event.transactionHash,
                        blockHash: event.blockHash,
                        blockNumber: event.blockNumber,
                        type: eventTypes[index],
                    })
                }))
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
        .then(([...transactions]) => transactions.map(([event, tx, receipt, block]): TransactionEntity => {
            const rest = {}

            if (receipt.status === true) {
                rest.receipt = receipt
            } else {
                rest.error = new TransactionError(I18n.t('error.txFailed'), receipt)
            }

            let inputValues
            try {
                inputValues = getInputValues(event.type, receipt.logs)
            } catch (e) {
                console.warn(e)
            }
            return {
                id: event.id,
                hash: tx.hash,
                state: 'completed',
                gasUsed: receipt.gasUsed,
                gasPrice: tx.gas,
                timestamp: block.timestamp * 1000,
                ...(inputValues || {}),
                ...rest,
            }
        }))
}
