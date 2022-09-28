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
import InsufficientTokenDialog from '../InsufficientTokenDialog'

export type Props = {
    onCancel: () => void,
    required: Required,
    balances: Balances,
    paymentCurrency: PaymentCurrency,
    nativeTokenName: string,
    productTokenSymbol: string,
}

const NoBalanceDialog = ({
    onCancel,
    required,
    balances,
    paymentCurrency,
    nativeTokenName,
    productTokenSymbol,
}: Props) => {
    const currentNativeBalance = BN(balances.native)
    const requiredGasBalance = BN(required.gas)

    // Not enough gas for any transaction
    if (currentNativeBalance.isLessThan(requiredGasBalance) || currentNativeBalance.isZero()) {
        return <GetCryptoDialog onCancel={onCancel} nativeTokenName={nativeTokenName} />
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH: {
            const requiredEthBalance = BN(required.native)
            if (currentNativeBalance.isLessThan(requiredEthBalance)) {
                return <InsufficientTokenDialog onCancel={onCancel} tokenSymbol={nativeTokenName} />
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
        case paymentCurrencies.PRODUCT_DEFINED: {
            const currentProductTokenBalance = BN(balances.productToken)
            const requiredProductTokenBalance = BN(required.productToken)
            if (currentProductTokenBalance.isLessThan(requiredProductTokenBalance)) {
                return <InsufficientTokenDialog onCancel={onCancel} tokenSymbol={productTokenSymbol} />
            }
            break
        }
        default:
            return <GetCryptoDialog onCancel={onCancel} nativeTokenName={nativeTokenName} />
    }

    return null
}

export default NoBalanceDialog
