// @flow

import React, { useMemo } from 'react'
import BN from 'bignumber.js'

import Balance from '$userpages/components/Balance'
import { BalanceType } from '$shared/flowtype/integration-key-types'
import { useBalances } from '$shared/hooks/useBalances'

const AccountsBalance = () => {
    // Use the balances stored in redux state to calculate the combined
    // value of all accounts (including the generated private key accounts).
    // Balances are polled in GlobalInfoWatcher component and we can assume
    // that they will be present here.
    const { balances } = useBalances()

    const { ethBalance, dataBalance } = useMemo(() => {
        const { eth, data } = Object.values(balances).reduce(({ eth: prevEth, data: prevData }, innerBalance: Object) => ({
            eth: prevEth.plus(innerBalance[BalanceType.ETH] || '0'),
            data: prevData.plus(innerBalance[BalanceType.DATA] || '0'),
        }), {
            eth: BN(0),
            data: BN(0),
        })

        return {
            ethBalance: eth.decimalPlaces(4).toString(),
            dataBalance: data.decimalPlaces(4).toString(),
        }
    }, [balances])

    return (
        <Balance>
            <Balance.Account
                name="DATA"
                value={dataBalance}
            />
            <Balance.Account
                name="ETH"
                value={ethBalance}
            />
        </Balance>
    )
}

export default AccountsBalance
