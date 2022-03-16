// @flow

import React from 'react'
import BN from 'bignumber.js'

import { paymentCurrencies } from '$shared/utils/constants'
import type { PaymentCurrency } from '$shared/flowtype/common-types'
import type { Required, Balances } from '$mp/errors/NoBalanceError'
import GetCryptoDialog from '../GetCryptoDialog'
import GetDataTokensDialog from '../GetDataTokensDialog'
import InsufficientDataDialog from '../InsufficientDataDialog'
import InsufficientDaiDialog from '../InsufficientDaiDialog'
import InsufficientEthDialog from '../InsufficientEthDialog'

export type Props = {
    onCancel: () => void,
    required: Required,
    balances: Balances,
    paymentCurrency: PaymentCurrency,
    nativeTokenName: string,
}

const NoBalanceDialog = ({
    onCancel,
    required,
    balances,
    paymentCurrency,
    nativeTokenName,
}: Props) => {
    const currentEthBalance = BN(balances.eth)
    const requiredGasBalance = BN(required.gas)

    // Not enough gas for any transaction
    if (currentEthBalance.isLessThan(requiredGasBalance) || currentEthBalance.isZero()) {
        return <GetCryptoDialog onCancel={onCancel} nativeTokenName={nativeTokenName} />
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH: {
            const requiredEthBalance = BN(required.eth)
            if (currentEthBalance.isLessThan(requiredEthBalance)) {
                return <InsufficientEthDialog onCancel={onCancel} />
            }
            break
        }
        case paymentCurrencies.DATA: {
            const currentDataBalance = BN(balances.data)
            if (currentDataBalance.isZero()) {
                return <GetDataTokensDialog onCancel={onCancel} />
            }

            const requiredDataBalance = BN(required.data)
            if (currentDataBalance.isLessThan(requiredDataBalance)) {
                return <InsufficientDataDialog onCancel={onCancel} />
            }
            break
        }
        case paymentCurrencies.DAI: {
            const currentDaiBalance = BN(balances.dai)
            const requiredDaiBalance = BN(required.dai)
            if (currentDaiBalance.isLessThan(requiredDaiBalance)) {
                return <InsufficientDaiDialog onCancel={onCancel} />
            }
            break
        }
        default:
            return <GetCryptoDialog onCancel={onCancel} nativeTokenName={nativeTokenName} />
    }

    return null
}

export default NoBalanceDialog
