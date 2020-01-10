// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import type { TimeUnit, PaymentCurrency } from '$shared/flowtype/common-types'
import { paymentCurrencies } from '$shared/utils/constants'

export type Props = {
    name: string,
    time: string,
    timeUnit: TimeUnit,
    price: BN,
    ethPrice: BN,
    daiPrice: BN,
    purchaseStarted: boolean,
    onCancel: () => void,
    onPay: () => void | Promise<void>,
    paymentCurrency: PaymentCurrency,
}

export const PurchaseSummaryDialog = ({
    name,
    time,
    timeUnit,
    price,
    ethPrice,
    daiPrice,
    purchaseStarted,
    onCancel,
    onPay,
    paymentCurrency,
}: Props) => {
    const priceInChosenCurrency = () => {
        if (paymentCurrency === paymentCurrencies.ETH) {
            return ethPrice.toFixed(4)
        } else if (paymentCurrency === paymentCurrencies.DAI) {
            return daiPrice.toFixed(2)
        }
        return price.toFixed(4)
    }

    if (purchaseStarted) {
        return (
            <ModalPortal>
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.purchaseSummary.started.title')}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            onClick: onCancel,
                            kind: 'link',
                        },
                        publish: {
                            title: I18n.t('modal.common.waiting'),
                            kind: 'primary',
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p><Translate value="modal.purchaseSummary.started.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            </ModalPortal>
        )
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.purchaseSummary.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        kind: 'link',
                        onClick: onCancel,
                    },
                    next: {
                        title: I18n.t('modal.purchaseSummary.pay'),
                        kind: 'primary',
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
                        price={priceInChosenCurrency()}
                        priceCurrency={paymentCurrency}
                    />
                </p>
            </Dialog>
        </ModalPortal>
    )
}

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
    purchaseStarted: false,
}

export default PurchaseSummaryDialog
