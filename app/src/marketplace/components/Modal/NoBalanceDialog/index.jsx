// @flow

import React from 'react'
import BN from 'bignumber.js'

import GetCryptoDialog from '../GetCryptoDialog'
import GetDataTokensDialog from '../GetDataTokensDialog'
import InsufficientDataDialog from '../InsufficientDataDialog'
import InsufficientDaiDialog from '../InsufficientDaiDialog'
import InsufficientEthDialog from '../InsufficientEthDialog'

import { paymentCurrencies } from '$shared/utils/constants'
import type { PaymentCurrency } from '$shared/flowtype/common-types'

export type Props = {
    onCancel: () => void,
    requiredGasBalance: BN,
    requiredEthBalance: BN,
    currentEthBalance: BN,
    requiredDataBalance: BN,
    currentDataBalance: BN,
    currentDaiBalance: BN,
    requiredDaiBalance: BN,
    paymentCurrency: PaymentCurrency,
}

const NoBalanceDialog = ({
    onCancel,
    requiredGasBalance,
    requiredEthBalance,
    currentEthBalance,
    requiredDataBalance,
    currentDataBalance,
    currentDaiBalance,
    requiredDaiBalance,
    paymentCurrency,
}: Props) => {
    // Not enough gas for any transaction
    if (currentEthBalance.isLessThan(requiredGasBalance) || currentEthBalance.isZero()) {
        return <GetCryptoDialog onCancel={onCancel} />
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            if (currentEthBalance.isLessThan(requiredEthBalance)) {
                return <InsufficientEthDialog onCancel={onCancel} />
            }
            break
        case paymentCurrencies.DATA:
            // Bandaid fix to avoid deprecated purchase modal crash
            if (!currentDataBalance) {
                return <GetDataTokensDialog onCancel={onCancel} />
            }

            if (currentDataBalance.isZero()) {
                return <GetDataTokensDialog onCancel={onCancel} />
            }

            if (currentDataBalance.isLessThan(requiredDataBalance)) {
                return <InsufficientDataDialog onCancel={onCancel} />
            }
            break
        case paymentCurrencies.DAI:
            if (currentDaiBalance.isLessThan(requiredDaiBalance)) {
                return <InsufficientDaiDialog onCancel={onCancel} />
            }
            break
        default:
            return <GetCryptoDialog onCancel={onCancel} />
    }

    return null
}

export default NoBalanceDialog
