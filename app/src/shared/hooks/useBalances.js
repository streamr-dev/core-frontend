// @flow

import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import type { Address } from '$shared/flowtype/web3-types'
import { BalanceType } from '$shared/flowtype/integration-key-types'
import { selectBalances } from '$shared/modules/integrationKey/selectors'
import { updateBalances } from '$shared/modules/integrationKey/actions'

export function useBalances() {
    const dispatch = useDispatch()
    const balances = useSelector(selectBalances)

    const update = useCallback(() => {
        dispatch(updateBalances())
    }, [dispatch])

    return useMemo(() => ({
        update,
        balances,
    }), [
        update,
        balances,
    ])
}

export function useAccountBalance(account: Address, balanceType: $Values<typeof BalanceType>) {
    const { balances } = useBalances()

    const balance = useMemo(() => {
        const accountBalance = balances[account] || {}

        return accountBalance[balanceType] ? accountBalance[balanceType].decimalPlaces(4).toString() : '-'
    }, [balances, account, balanceType])

    return balance
}
