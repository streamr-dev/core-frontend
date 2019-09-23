// @flow

import { useState, useEffect, useCallback, useMemo } from 'react'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import getWeb3, { validateWeb3 } from '$shared/web3/web3Provider'
import { WalletLockedError } from '$shared/errors/Web3'

import Web3Poller from '$shared/web3/web3Poller'

import useIsMounted from './useIsMounted'

type Result = {
    web3Error: ?ErrorInUi | ?Error,
    checkingWeb3: boolean,
    isLocked: boolean,
}

export function useWeb3Status(requireWeb3: boolean = true): Result {
    const [web3Error, setWeb3Error] = useState(null)
    const [checkingWeb3, setCheckingWeb3] = useState(false)
    const isMounted = useIsMounted()
    const [account, setAccount] = useState(null)

    useEffect(() => {
        if (!requireWeb3 || checkingWeb3) { return () => {} }

        const onAccount = (nextAccount) => {
            if (!isMounted()) { return }
            setAccount(nextAccount)
            setWeb3Error(null)
        }

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT, onAccount)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, onAccount)
        }
    }, [requireWeb3, checkingWeb3, isMounted])

    useEffect(() => {
        if (!requireWeb3 || !account) { return () => {} }

        const setLocked = () => {
            if (!isMounted()) { return }
            setWeb3Error(new WalletLockedError())
            setAccount(null)
        }

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT_ERROR, setLocked)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT_ERROR, setLocked)
        }
    }, [requireWeb3, account, isMounted])

    const validate = useCallback(async () => {
        setCheckingWeb3(true)

        const web3 = getWeb3()
        try {
            await validateWeb3({
                web3,
            })
            if (!isMounted()) { return }

            const nextAccount = await web3.getDefaultAccount()

            if (!isMounted()) { return }

            setAccount(nextAccount)
            setWeb3Error(null)
        } catch (e) {
            setWeb3Error(e)
        }

        setCheckingWeb3(false)
    }, [isMounted])

    useEffect(() => {
        if (!requireWeb3 || account || web3Error) { return }

        validate()
    }, [requireWeb3, account, web3Error, validate])

    return useMemo(() => ({
        requireWeb3,
        web3Error,
        checkingWeb3,
        isLocked: !!checkingWeb3 || !!web3Error,
    }), [requireWeb3, web3Error, checkingWeb3])
}

export default useWeb3Status
