// @flow

import { I18n } from 'react-redux-i18n'

import { getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { HashList, TransactionEntityList, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import TransactionError from '$shared/errors/TransactionError'

export const getTransactionEvents = (addresses: HashList): Promise<EventLogList> => {
    const web3 = getPublicWeb3()
    const config = getConfig().marketplace
    const marketPlaceContract = new web3.eth.Contract(config.abi, config.address)

    const rawEvents = []

    // Get past events by filtering with the indexed address parameter.
    const eventNames = {
        Subscribed: 'subscriber',
        ProductCreated: 'owner',
        ProductUpdated: 'owner',
        ProductDeleted: 'owner',
    }
    const eventPromises = Object.keys(eventNames).map((eventName) => {
        const filterField = eventNames[eventName]
        return marketPlaceContract.getPastEvents(eventName, {
            fromBlock: 1,
            filter: {
                [filterField]: addresses,
            },
        })
    })

    return Promise.all(eventPromises)
        .then(([...eventLists]) => {
            eventLists.forEach((events) => {
                rawEvents.push(...events)
            })

            return rawEvents.sort((a: any, b: any) => b.blockNumber - a.blockNumber)
        })
}

export const getTransactionsFromEvents = (events: EventLogList): Promise<TransactionEntityList> => {
    const web3 = getPublicWeb3()

    // Fetch events that don't yet exists in transaction entities
    return Promise.all(events.map((event: EventLog) => Promise.all([
        Promise.resolve(event),
        web3.eth.getTransaction(event.transactionHash),
        web3.eth.getTransactionReceipt(event.transactionHash),
        web3.eth.getBlock(event.blockHash),
    ])))
        .then(([...transactions]) =>
            transactions.map(([event, tx, receipt, block]) => ({
                id: tx.hash,
                type: event.event,
                state: 'completed',
                value: 0,
                gasUsed: receipt.gasUsed,
                gasPrice: tx.gas,
                timestamp: block.timestamp,
                ...((receipt.status === true) ? {
                    receipt,
                } : {
                    error: new TransactionError(I18n.t('error.txFailed'), receipt),
                }),
            })))
}
