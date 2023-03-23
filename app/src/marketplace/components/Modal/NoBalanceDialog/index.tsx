import React, { FunctionComponent } from 'react'
import BN from 'bignumber.js'
import { paymentCurrencies } from '$shared/utils/constants'
import { PaymentCurrency } from '$shared/types/common-types'
import { Required, Balances } from '$mp/errors/NoBalanceError'
import GetCryptoDialog from '../GetCryptoDialog'
import GetDataTokensDialog from '../GetDataTokensDialog'
import InsufficientDataDialog from '../InsufficientDataDialog'
import InsufficientDaiDialog from '../InsufficientDaiDialog'
import InsufficientTokenDialog from '../InsufficientTokenDialog'
export type Props = {
    onCancel: () => void
    required: Required
    balances: Balances
    paymentCurrency: PaymentCurrency
    nativeTokenName?: string
    productTokenSymbol?: string
}

const NoBalanceDialog: FunctionComponent<Props> = ({
    onCancel,
    required,
    balances,
    paymentCurrency,
    nativeTokenName,
    productTokenSymbol,
}: Props) => {
    const currentNativeBalance = new BN(balances.native)
    const requiredGasBalance = new BN(required.gas)

    // Not enough gas for any transaction
    if (currentNativeBalance.isLessThan(requiredGasBalance) || currentNativeBalance.isZero()) {
        return <GetCryptoDialog onCancel={onCancel} nativeTokenName={nativeTokenName} />
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH: {
            const requiredEthBalance = new BN(required.native)

            if (currentNativeBalance.isLessThan(requiredEthBalance)) {
                return <InsufficientTokenDialog onCancel={onCancel} tokenSymbol={nativeTokenName} />
            }

            break
        }

        case paymentCurrencies.DATA: {
            const currentDataBalance = new BN(balances.data)

            if (currentDataBalance.isZero()) {
                return <GetDataTokensDialog onCancel={onCancel} />
            }

            const requiredDataBalance = new BN(required.data)

            if (currentDataBalance.isLessThan(requiredDataBalance)) {
                return <InsufficientDataDialog onCancel={onCancel} />
            }

            break
        }

        case paymentCurrencies.DAI: {
            const currentDaiBalance = new BN(balances.dai)
            const requiredDaiBalance = new BN(required.dai)

            if (currentDaiBalance.isLessThan(requiredDaiBalance)) {
                return <InsufficientDaiDialog onCancel={onCancel} />
            }

            break
        }

        case paymentCurrencies.PRODUCT_DEFINED: {
            const currentProductTokenBalance = new BN(balances.productToken)
            const requiredProductTokenBalance = new BN(required.productToken)

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
