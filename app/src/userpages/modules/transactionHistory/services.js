// @flow

import { I18n } from 'react-redux-i18n'
import abiDecoder from 'abi-decoder'
import BN from 'bignumber.js'

import { transactionTypes } from '$shared/utils/constants'
import { getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { HashList, TransactionEntityList, TransactionEntity, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import TransactionError from '$shared/errors/TransactionError'
// import { getUnprefixedHexString } from '$mp/utils/smartContract'

const getInputValues = (type, logs) => {
    const logValues = abiDecoder.decodeLogs(logs)

    switch (type) {
        case 'PaymentReceived':
            // hack to handle minting coins to account (also a transfer event)
            if (logValues[1].name === 'Minted') {
                return {
                    productId: '0x0',
                    type: transactionTypes.PAYMENT,
                    value: logValues[1].events[0].value,
                }
            }

            return {
                productId: logValues[1].events[0].value,
                type: transactionTypes.PAYMENT,
                value: logValues[2].events[2].value,
            }

        case 'PaymentSent':
            return {
                productId: logValues[1].events[0].value,
                type: transactionTypes.PURCHASE,
                value: BN(logValues[2].events[2].value).negated(),
            }

        case 'ProductCreated':
            return {
                productId: logValues[0].events[1].value,
                type: transactionTypes.CREATE_CONTRACT_PRODUCT,
                value: '0',
            }

        case 'ProductUpdated':
            return {
                productId: logValues[0].events[1].value,
                type: transactionTypes.UPDATE_CONTRACT_PRODUCT,
                value: '0',
            }

        case 'ProductDeleted':
            return {
                productId: logValues[0].events[1].value,
                type: transactionTypes.UNDEPLOY_PRODUCT,
                value: '0',
            }

        case 'ProductRedeployed':
            return {
                productId: logValues[0].events[1].value,
                type: transactionTypes.REDEPLOY_PRODUCT,
                value: '0',
            }

        default:
            return {}
    }
}

export const getTransactionEvents = (addresses: HashList): Promise<EventLogList> => {
    const web3 = getPublicWeb3()
    const { marketplace, dataToken } = getConfig()
    const marketPlaceContract = new web3.eth.Contract(marketplace.abi, marketplace.address)
    const tokenContract = new web3.eth.Contract(dataToken.abi, dataToken.address)
    abiDecoder.addABI(marketplace.abi)
    abiDecoder.addABI(dataToken.abi)

    const rawEvents = []

    // Get past events by filtering with the indexed address parameter.
    const eventNames = [{
        contract: tokenContract, name: 'Transfer', filter: 'to', type: 'PaymentReceived',
    }, {
        contract: tokenContract, name: 'Transfer', filter: 'from', type: 'PaymentSent',
    }, {
        contract: marketPlaceContract, name: 'ProductCreated', filter: 'owner', type: 'ProductCreated',
    }, {
        contract: marketPlaceContract, name: 'ProductUpdated', filter: 'owner', type: 'ProductUpdated',
    }, {
        contract: marketPlaceContract, name: 'ProductDeleted', filter: 'owner', type: 'ProductDeleted',
    }, {
        contract: marketPlaceContract, name: 'ProductRedeployed', filter: 'owner', type: 'ProductRedeployed',
    }]
    const eventTypes = eventNames.map(({ type }) => type)
    const eventPromises = eventNames.map(({ contract, name, filter }) => contract.getPastEvents(name, {
        fromBlock: 1,
        filter: {
            [(filter: string)]: addresses,
        },
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
        .then(([...transactions]) =>
            transactions.map(([event, tx, receipt, block]): TransactionEntity => {
                const rest = {}

                if (receipt.status === true) {
                    rest.receipt = receipt
                } else {
                    rest.error = new TransactionError(I18n.t('error.txFailed'), receipt)
                }

                return {
                    id: event.id,
                    hash: tx.hash,
                    state: 'completed',
                    gasUsed: receipt.gasUsed,
                    gasPrice: tx.gas,
                    timestamp: block.timestamp,
                    ...getInputValues(event.type, receipt.logs),
                    ...rest,
                }
            }))
}
