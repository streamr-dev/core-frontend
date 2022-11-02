import React, { FunctionComponent, useMemo } from 'react'
import BN from 'bignumber.js'
import Balance, { Account } from '$userpages/components/Balance'
import { BalanceType } from '$shared/types/user-types'
import { useBalances } from '$shared/hooks/useBalances'

const AccountsBalance: FunctionComponent = () => {
    // Use the balances stored in redux state to calculate the combined
    // value of all accounts (including the generated private key accounts).
    // Balances are polled in GlobalInfoWatcher component and we can assume
    // that they will be present here.
    const { balances } = useBalances()
    const { ethBalance, dataBalance } = useMemo(
        () => ({
            ethBalance: BN(balances[BalanceType.ETH] || '0')
                .decimalPlaces(4)
                .toString(),
            dataBalance: BN(balances[BalanceType.DATA] || '0')
                .decimalPlaces(4)
                .toString(),
        }),
        [balances],
    )
    return (
        <Balance>
            <Account name="DATA" value={dataBalance} />
            <Account name="ETH" value={ethBalance} />
        </Balance>
    )
}

export default AccountsBalance
