// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import Dialog from '$shared/components/Dialog'
import type { Currency, TimeUnit } from '$shared/flowtype/common-types'

export type Props = {
    name: string,
    time: string,
    timeUnit: TimeUnit,
    price: BN,
    priceCurrency: Currency,
    purchaseStarted: boolean,
    onCancel: () => void,
    onPay: () => void | Promise<void>,
}

export const PurchaseSummaryDialog = ({
    name,
    time,
    timeUnit,
    price,
    priceCurrency,
    purchaseStarted,
    onCancel,
    onPay,
}: Props) => {
    if (purchaseStarted) {
        return (
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.purchaseSummary.started.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: onCancel,
                        type: 'link',
                    },
                    publish: {
                        title: I18n.t('modal.common.waiting'),
                        type: 'primary',
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

    return (
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.purchaseSummary.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    type: 'link',
                    onClick: onCancel,
                },
                next: {
                    title: I18n.t('modal.purchaseSummary.pay'),
                    type: 'primary',
                    onClick: () => onPay(),
                },
            }}
        >
            <h6>{name}</h6>
            <p>
                <Translate
                    value="modal.purchaseSummary.access"
                    time={time}
                    timeUnit={I18n.t(`common.timeUnit.${timeUnit}`)}
                />
            </p>
            <p>
                <Translate
                    value="modal.purchaseSummary.price"
                    price={price}
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

export default PurchaseSummaryDialog
