// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import Dialog from '../Dialog'
import { toSeconds } from '../../../utils/time'
import withI18n from '../../../containers/WithI18n'
import type { Product, SmartContractProduct } from '../../../flowtype/product-types'
import type { Purchase } from '../../../flowtype/common-types'

export type Props = {
    product: Product,
    contractProduct: SmartContractProduct,
    purchase: Purchase,
    purchaseStarted: boolean,
    onCancel: () => void,
    onPay: () => void,
    translate: (key: string, options: any) => string,
}

export const PurchaseSummaryDialog = ({
    product,
    contractProduct,
    purchase,
    purchaseStarted,
    onCancel,
    onPay,
    translate,
}: Props) => {
    if (purchaseStarted) {
        return (
            <Dialog
                onClose={onCancel}
                title={translate('modal.purchaseSummary.started.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
                    },
                    publish: {
                        title: translate('modal.common.waiting'),
                        color: 'primary',
                        disabled: true,
                        spinner: true,
                    },
                }}
            >
                <div>
                    <p><Translate value="modal.purchaseSummary.started.message" dangerousHTML /></p>
                </div>
            </Dialog>
        )
    }

    const { pricePerSecond, priceCurrency } = contractProduct

    return (
        <Dialog
            onClose={onCancel}
            title={translate('modal.purchaseSummary.title')}
            actions={{
                cancel: {
                    title: translate('modal.common.cancel'),
                    outline: true,
                    onClick: onCancel,
                },
                next: {
                    title: translate('modal.purchaseSummary.pay'),
                    color: 'primary',
                    onClick: () => onPay(),
                },
            }}
        >
            <h6>{product.name}</h6>
            <p>
                <Translate
                    value="modal.purchaseSummary.access"
                    time={purchase.time}
                    timeUnit={translate(`common.timeUnit.${purchase.timeUnit}`)}
                />
            </p>
            <p>
                <Translate
                    value="modal.purchaseSummary.price"
                    price={toSeconds(purchase.time, purchase.timeUnit).multipliedBy(pricePerSecond).toString()}
                    priceCurrency={priceCurrency}
                />
            </p>
        </Dialog>
    )
}

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
    purchaseStarted: false,
}

export default withI18n(PurchaseSummaryDialog)
