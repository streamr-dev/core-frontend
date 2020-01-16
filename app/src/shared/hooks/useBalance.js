// @flow

import { useState, useEffect, useCallback, useMemo } from 'react'

import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'
import type { Address } from '$shared/flowtype/web3-types'

import useIsMounted from './useIsMounted'

export const BalanceType = {
    ETH: 'ETH',
    DATA: 'DATA',
}

type GetBalance = {
    address: Address,
    type: $Values<typeof BalanceType>,
    usePublicNode?: boolean,
}

export async function getBalance({ address, type, usePublicNode = false }: GetBalance) {
    let balance

    if (type === BalanceType.ETH) {
        balance = await getEthBalance(address, usePublicNode)
    } else if (type === BalanceType.DATA) {
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
    const isMounted = useIsMounted()

    const loadBalance = useCallback(async (address, type) => {
        setFetching(true)
        setBalance(undefined)

        try {
            const newBalance = await getBalance({
                address,
                type,
                usePublicNode: true,
            })

            if (isMounted() && newBalance) {
                setBalance(newBalance.decimalPlaces(4).toString())
            }
        } catch (e) {
            console.warn(e)
            if (isMounted()) {
                setError(e)
            }
        } finally {
            if (isMounted()) {
                setFetching(false)
            }
        }
    }, [isMounted])

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
