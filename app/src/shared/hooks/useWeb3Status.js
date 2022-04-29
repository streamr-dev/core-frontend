// @flow

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { validateWeb3 } from '$shared/web3/web3Provider'
import getWeb3 from '$utils/web3/getWeb3'
import WalletLockedError from '$shared/errors/WalletLockedError'
import type { Address } from '$shared/flowtype/web3-types'
import { networks } from '$shared/utils/constants'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import Web3Poller from '$shared/web3/web3Poller'
import useIsMounted from './useIsMounted'

type Result = {
    requireWeb3: boolean,
    web3Error: ?ErrorInUi | ?Error,
    checkingWeb3: boolean,
    isLocked: boolean,
    account: ?Address,
}

type Web3Status = {
    requireWeb3: boolean,
    requireNetwork?: $Values<typeof networks>,
}

export default function useWeb3Status({ requireWeb3 = true, requireNetwork = networks.MAINNET }: Web3Status = {}): Result {
    const [web3Error, setWeb3Error] = useState(null)
    const [checkingWeb3, setCheckingWeb3] = useState(false)
    const isMounted = useIsMounted()
    const [account, setAccount] = useState(null)

    const validate = useCallback(async () => {
        setCheckingWeb3(true)

        const web3 = getWeb3()
        try {
            await validateWeb3({
                web3,
                requireNetwork,
                unlockTimeout: true,
            })
            if (!isMounted()) { return }

            const nextAccount = await getDefaultWeb3Account(web3)

            if (!isMounted()) { return }

            setAccount(nextAccount)
            setWeb3Error(null)
        } catch (e) {
            setAccount(null)
            setWeb3Error(e)
        }

        setCheckingWeb3(false)
    }, [isMounted, requireNetwork])

    useEffect(() => {
        if (!requireWeb3 || checkingWeb3) { return () => {} }

        const onChange = () => {
            if (!isMounted()) { return }
            validate()
        }

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT, onChange)
        Web3Poller.subscribe(Web3Poller.events.NETWORK, onChange)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, onChange)
            Web3Poller.unsubscribe(Web3Poller.events.NETWORK, onChange)
        }
    }, [requireWeb3, checkingWeb3, isMounted, validate])

    useEffect(() => {
        if (!requireWeb3) { return () => {} }

        const setLocked = () => {
            if (!isMounted()) { return }
            setWeb3Error(new WalletLockedError())
            setAccount(null)
        }

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT_ERROR, setLocked)
        Web3Poller.subscribe(Web3Poller.events.NETWORK_ERROR, setLocked)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT_ERROR, setLocked)
            Web3Poller.unsubscribe(Web3Poller.events.NETWORK_ERROR, setLocked)
        }
    }, [requireWeb3, account, isMounted])

    useEffect(() => {
        if (!requireWeb3 || account || web3Error) { return }

        validate()
    }, [requireWeb3, account, web3Error, validate])

    return useMemo(() => ({
        requireWeb3,
        web3Error,
        checkingWeb3,
        isLocked: !!checkingWeb3 || (!account || !!web3Error),
        account,
    }), [requireWeb3, web3Error, checkingWeb3, account])
}
