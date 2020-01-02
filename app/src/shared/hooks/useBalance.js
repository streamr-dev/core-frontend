// @flow

import { useState, useEffect, useCallback, useMemo } from 'react'

import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'
import type { Address } from '$shared/flowtype/web3-types'

export const BalanceType = {
    ETH: 'ETH',
    DATA: 'DATA',
}

export async function getBalance(address: Address, balanceType: $Values<typeof BalanceType>, usePublicNode?: boolean = false) {
    let balance

    if (balanceType === BalanceType.ETH) {
        balance = await getEthBalance(address, usePublicNode)
    } else if (balanceType === BalanceType.DATA) {
        balance = await getDataTokenBalance(address, usePublicNode)
    } else {
        throw new Error('Unknown balance type!')
    }

    return balance
}

export function useBalance(account: Address, balanceType: $Values<typeof BalanceType>) {
    const [fetching, setFetching] = useState(false)
    const [balance, setBalance] = useState(undefined)
    const [error, setError] = useState(undefined)

    const loadBalance = useCallback(async (address, type) => {
        setFetching(true)
        setBalance(undefined)

        try {
            const newBalance = await getBalance(address, type, true)

            if (newBalance) {
                setBalance(newBalance.decimalPlaces(4).toString())
            }
        } catch (e) {
            console.warn(e)
            setError(e)
        } finally {
            setFetching(false)
        }
    }, [])

    useEffect(() => {
        if (!account) {
            return
        }

        loadBalance(account, balanceType)
    }, [loadBalance, account, balanceType])

    return useMemo(() => ({
        fetching,
        balance,
        error,
    }), [
        fetching,
        balance,
        error,
    ])
}

export default useBalance
