// @flow

import React, { type Node, useCallback, useEffect, useRef, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { Hash, Receipt } from '$shared/flowtype/web3-types'
import { getUserData, logout } from '$shared/modules/user/actions'
import { getDataPerUsd, setEthereumNetworkId } from '$mp/modules/global/actions'
import {
    addTransaction,
    completeTransaction,
    transactionError,
} from '$mp/modules/transactions/actions'
import { getTransactionsFromSessionStorage } from '$shared/utils/transactions'
import TransactionError from '$shared/errors/TransactionError'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import { useBalances } from '$shared/hooks/useBalances'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import type { NumberString } from '$shared/flowtype/common-types'
import { isEthereumAddress } from '$mp/utils/validate'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import { setupSession } from '$shared/reducers/session'
import SwitchAccountModal from './SwitchAccountModal'

type Props = {
    children?: Node,
}

const LOGIN_POLL_INTERVAL = 1000 * 60 * 5 // 5min
const ACCOUNT_BALANCE_POLL_INTERVAL = 1000 * 60 * 5 // 5min
const USD_RATE_POLL_INTERVAL = 1000 * 60 * 60 * 6 // 6h
const PENDING_TX_WAIT = 1000 // 1s

export const GlobalInfoWatcher = ({ children }: Props) => {
    const dispatch = useDispatch()
    const address = useAccountAddress()
    const chainId = useSelector(selectEthereumNetworkId)

    // Poll usd rate from contract
    const dataPerUsdRatePollTimeout = useRef()
    const dataPerUsdRatePoll = useCallback(() => {
        if (chainId == null) {
            return
        }

        clearTimeout(dataPerUsdRatePollTimeout.current)
        dispatch(getDataPerUsd(chainId))

        dataPerUsdRatePollTimeout.current = setTimeout(dataPerUsdRatePoll, USD_RATE_POLL_INTERVAL)
    }, [dispatch, chainId])

    useEffect(() => {
        dataPerUsdRatePoll()

        return () => {
            clearTimeout(dataPerUsdRatePollTimeout.current)
        }
    }, [dataPerUsdRatePoll])

    // Poll login info
    const loginPollTimeout = useRef()
    const loginPoll = useCallback(() => {
        clearTimeout(loginPollTimeout.current)
        dispatch(getUserData())

        loginPollTimeout.current = setTimeout(loginPoll, LOGIN_POLL_INTERVAL)
    }, [dispatch])

    useEffect(() => {
        loginPoll()

        return () => {
            clearTimeout(loginPollTimeout.current)
        }
    }, [loginPoll])

    // Poll transactions
    useEffect(() => {
        const transactionsTimeout = setTimeout(() => {
            const pendingTransactions = getTransactionsFromSessionStorage()
            Object.keys(pendingTransactions)
                .forEach((txHash) => {
                    dispatch(addTransaction(txHash, pendingTransactions[txHash]))
                })
        }, PENDING_TX_WAIT)

        return () => {
            clearTimeout(transactionsTimeout)
        }
    }, [dispatch])

    const handleTransactionComplete = useCallback((id: Hash, receipt: Receipt) => {
        dispatch(completeTransaction(id, receipt))
    }, [dispatch])

    const handleTransactionError = useCallback((id: Hash, error: TransactionError) => {
        dispatch(transactionError(id, error))
    }, [dispatch])

    useEffect(() => {
        Web3Poller.subscribe(events.TRANSACTION_COMPLETE, handleTransactionComplete)
        Web3Poller.subscribe(events.TRANSACTION_ERROR, handleTransactionError)

        return () => {
            Web3Poller.unsubscribe(events.TRANSACTION_COMPLETE, handleTransactionComplete)
            Web3Poller.unsubscribe(events.TRANSACTION_ERROR, handleTransactionError)
        }
    }, [handleTransactionComplete, handleTransactionError])

    // Poll balances for username
    const { update: updateBalances } = useBalances()
    const balanceTimeout = useRef()
    const balancePoll = useCallback(() => {
        clearTimeout(balanceTimeout.current)
        updateBalances()

        balanceTimeout.current = setTimeout(balancePoll, ACCOUNT_BALANCE_POLL_INTERVAL)
    }, [updateBalances])
    const user = useSelector(selectUserData)
    const { username } = user || {}

    useEffect(() => {
        if (!username || !isEthereumAddress(username)) { return () => {} }

        // start polling for the balance
        balancePoll()

        return () => {
            clearTimeout(balanceTimeout.current)
        }
    }, [balancePoll, username])

    // Poll network
    useEffect(() => {
        let currentNetworkId

        const onNetworkChange = (networkId: NumberString) => {
            const nextNetworkId = !(networkId instanceof Error) ? networkId : undefined

            if (!currentNetworkId || currentNetworkId !== nextNetworkId) {
                dispatch(setEthereumNetworkId(nextNetworkId))
            }

            currentNetworkId = networkId
        }

        Web3Poller.subscribe(events.NETWORK, onNetworkChange)
        Web3Poller.subscribe(events.NETWORK_ERROR, onNetworkChange)

        return () => {
            Web3Poller.unsubscribe(events.NETWORK, onNetworkChange)
            Web3Poller.unsubscribe(events.NETWORK_ERROR, onNetworkChange)
        }
    }, [dispatch])

    const [accountChanged, setAccountChanged] = useState(false)

    // show notice if Metamask account changes to a different account
    useEffect(() => {
        if (!username || !address) {
            return
        }

        setAccountChanged(address.toLowerCase() !== username.toLowerCase())
    }, [address, username])

    const onClose = useCallback(() => {
        setAccountChanged(false)
    }, [])

    const onContinue = useCallback(() => {
        setAccountChanged(false)
        dispatch(logout())
        dispatch(setupSession([]))
    }, [dispatch])

    return (
        <Fragment>
            <SwitchAccountModal
                isOpen={accountChanged}
                onClose={onClose}
                onContinue={onContinue}
            />
            {children || null}
        </Fragment>
    )
}

export default GlobalInfoWatcher
