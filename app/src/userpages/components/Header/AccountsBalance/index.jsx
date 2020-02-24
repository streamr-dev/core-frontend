// @flow

import React, { useMemo } from 'react'
import BN from 'bignumber.js'

import Balance from '$userpages/components/Balance'
import { BalanceType } from '$shared/flowtype/integration-key-types'
import { useBalances } from '$shared/hooks/useBalances'

import styles from './accountsBalance.pcss'

const AccountsBalance = () => {
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
        <Balance className={styles.balance}>
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
