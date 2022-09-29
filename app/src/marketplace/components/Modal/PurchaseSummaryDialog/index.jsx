// @flow

import React, { useMemo } from 'react'
import BN from 'bignumber.js'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import type { TimeUnit, PaymentCurrency } from '$shared/flowtype/common-types'
import { contractCurrencies } from '$shared/utils/constants'
import { formatDecimals } from '$mp/utils/price'

import styles from './purchaseSummaryDialog.pcss'

export type Props = {
    name: string,
    time: string,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    pricingTokenDecimals: BN,
    tokenSymbol: string,
    price: BN,
    approxUsd: BN,
    waiting?: boolean,
    onBack: () => void,
    onCancel: () => void,
    onPay: () => void | Promise<void>,
}

export const PurchaseSummaryDialog = ({
    name,
    time,
    timeUnit,
    price: priceProp,
    pricingTokenDecimals,
    paymentCurrency,
    tokenSymbol,
    approxUsd: approxUsdProp,
    waiting,
    onCancel,
    onBack,
    onPay,
}: Props) => {
    const price = useMemo(() => (
        formatDecimals(priceProp, paymentCurrency, pricingTokenDecimals)
    ), [priceProp, paymentCurrency, pricingTokenDecimals])

    const approxUsd = useMemo(() => (
        formatDecimals(approxUsdProp, contractCurrencies.USD, pricingTokenDecimals)
    ), [approxUsdProp, pricingTokenDecimals])

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title="Complete your subscription"
                actions={{
                    back: {
                        title: 'Back',
                        kind: 'link',
                        onClick: () => onBack(),
                        disabled: !!waiting,
                    },
                    next: {
                        title: 'Pay now',
                        kind: 'primary',
                        onClick: () => onPay(),
                        spinner: !!waiting,
                        disabled: !!waiting,
                    },
                }}
                contentClassName={styles.purchaseSummaryContent}
            >
                <p className={styles.purchaseInfo}>
                    <strong>{name}</strong>
                    <span className={styles.time}>
                        {time} {`${timeUnit}${time !== '1' ? 's' : ''}`}
                    </span>
                </p>
                <div>
                    <span className={styles.priceValue}>
                        {price}
                        <span className={styles.priceCurrency}>
                            {paymentCurrency === contractCurrencies.PRODUCT_DEFINED ? tokenSymbol : paymentCurrency}
                        </span>
                    </span>
                    <p className={styles.usdEquiv}>
                        Approx {approxUsd} {contractCurrencies.USD}
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
}

export default PurchaseSummaryDialog
