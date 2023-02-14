import React, {useCallback, useEffect, useRef, useState, Fragment, ReactNode, useContext} from 'react'
import { useDispatch } from 'react-redux'
import type { Hash, Receipt } from '$shared/types/web3-types'
import { setEthereumNetworkId } from '$mp/modules/global/actions'
import { addTransaction, completeTransaction, transactionError } from '$mp/modules/transactions/actions'
import { getTransactionsFromSessionStorage } from '$shared/utils/transactions'
import TransactionError from '$shared/errors/TransactionError'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import { useBalances } from '$shared/hooks/useBalances'
import type { NumberString } from '$shared/types/common-types'
import { isEthereumAddress } from '$mp/utils/validate'
import {AuthenticationControllerContext} from "$auth/authenticationController"
import useAccountAddress from '$shared/hooks/useAccountAddress'
import SwitchAccountModal from './SwitchAccountModal'
type Props = {
    children?: ReactNode
}
const LOGIN_POLL_INTERVAL = 1000 * 60 * 5 // 5min

const ACCOUNT_BALANCE_POLL_INTERVAL = 1000 * 60 * 5 // 5min

const PENDING_TX_WAIT = 1000 // 1s

export const GlobalInfoWatcher = ({ children }: Props) => {
    const dispatch = useDispatch()
    const address = useAccountAddress()
    // Poll transactions
    useEffect(() => {
        const transactionsTimeout = setTimeout(() => {
            const pendingTransactions = getTransactionsFromSessionStorage()
            Object.keys(pendingTransactions).forEach((txHash) => {
                dispatch(addTransaction(txHash, pendingTransactions[txHash]))
            })
        }, PENDING_TX_WAIT)
        return () => {
            clearTimeout(transactionsTimeout)
        }
    }, [dispatch])
    const handleTransactionComplete = useCallback(
        (id: Hash, receipt: Receipt) => {
            dispatch(completeTransaction(id, receipt))
        },
        [dispatch],
    )
    const handleTransactionError = useCallback(
        (id: Hash, error: TransactionError) => {
            dispatch(transactionError(id, error))
        },
        [dispatch],
    )
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
    const balanceTimeout = useRef<any>()
    const balancePoll = useCallback(() => {
        clearTimeout(balanceTimeout.current)
        updateBalances()
        balanceTimeout.current = setTimeout(balancePoll, ACCOUNT_BALANCE_POLL_INTERVAL)
    }, [updateBalances])

    const {currentAuthSession} = useContext(AuthenticationControllerContext)
    useEffect(() => {
        if (!currentAuthSession.address || !isEthereumAddress(currentAuthSession.address)) {
            return () => {}
        }

        // start polling for the balance
        balancePoll()
        return () => {
            clearTimeout(balanceTimeout.current)
        }
    }, [balancePoll, currentAuthSession])
    // Poll network
    useEffect(() => {
        let currentNetworkId: NumberString

        const onNetworkChange = (networkId: NumberString) => {
            const nextNetworkId = !((networkId as any) instanceof Error) ? networkId : undefined

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
        if (!currentAuthSession?.address || !address) {
            return
        }

        setAccountChanged(address.toLowerCase() !== currentAuthSession?.address?.toLowerCase())
    }, [address, currentAuthSession])
    const onClose = useCallback(() => {
        setAccountChanged(false)
    }, [])
    const onContinue = useCallback(() => {
        setAccountChanged(false)
    }, [dispatch])
    return (
        <Fragment>
            <SwitchAccountModal isOpen={accountChanged} onClose={onClose} onContinue={onContinue} />
            {children || null}
        </Fragment>
    )
}
export default GlobalInfoWatcher
