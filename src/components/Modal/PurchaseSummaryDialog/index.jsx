// @flow

import React from 'react'

import Dialog from '../Dialog'
import { toSeconds } from '../../../utils/time'
import { transactionStates } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { Purchase, TransactionState } from '../../../flowtype/common-types'

export type Props = {
    product: Product,
    purchase: Purchase,
    purchaseState: ?TransactionState,
    onCancel: () => void,
    onPay: () => void,
}

const PurchaseSummaryDialog = ({
    product,
    purchase,
    purchaseState,
    onCancel,
    onPay,
}: Props) => (
    <Dialog
        onClose={onCancel}
        title="Complete your purchase"
        waiting={!!purchaseState && purchaseState === transactionStates.STARTED}
        actions={{
            cancel: {
                title: 'Cancel',
                onClick: onCancel,
            },
            next: {
                title: 'Pay',
                color: 'primary',
                onClick: () => onPay(),
            },
        }}
    >
        <div>
            <h1>{product.name}</h1>
            <p>{purchase.time} {purchase.timeUnit} access</p>
            <p>{toSeconds(purchase.time, purchase.timeUnit) * product.pricePerSecond} {product.priceCurrency}</p>
        </div>
    </Dialog>
)

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
}

export default PurchaseSummaryDialog
