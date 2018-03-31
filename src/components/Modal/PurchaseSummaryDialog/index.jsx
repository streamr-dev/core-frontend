// @flow

import React from 'react'

import Dialog from '../Dialog'
import { toSeconds } from '../../../utils/helper'
import type { Product } from '../../../flowtype/product-types'
import type { Purchase } from '../../../flowtype/common-types'

export type Props = {
    product: Product,
    purchase: Purchase,
    waiting: boolean,
    onPay: () => void,
}

const PurchaseSummaryDialog = ({ product, purchase, waiting, onPay }: Props) => (
    <Dialog title="Complete your purchase" actions={{
        next: {
            title: 'Pay',
            onClick: () => onPay()
        }
    }}>
        {!waiting && (
            <div>
                <h1>{product.name}</h1>
                <p>{purchase.time} {purchase.timeUnit} access</p>
                <p>{toSeconds(purchase.time, purchase.timeUnit) * product.pricePerSecond} {product.priceCurrency}</p>
            </div>
        )}
        {waiting && (
            <div>
                Waiting for metamask...
            </div>
        )}
    </Dialog>
)

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
}

export default PurchaseSummaryDialog
