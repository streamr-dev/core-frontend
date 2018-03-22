// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { Product } from '../../../flowtype/product-types'

export type Props = {
    product: Product,
    waiting: boolean,
    onPay: () => void,
}

const PurchaseSummaryDialog = ({ product, waiting, onPay }: Props) => (
    <Dialog title="Complete your purchase" actions={{
        next: {
            title: 'Pay',
            onClick: () => onPay()
        }
    }}>
        {!waiting && (
            <div>
                <h1>{product.name}</h1>
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
