// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
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
    price: BN,
    approxUsd: BN,
    purchaseStarted?: boolean,
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
    paymentCurrency,
    approxUsd: approxUsdProp,
    purchaseStarted,
    waiting,
    onCancel,
    onBack,
    onPay,
}: Props) => {
    const price = useMemo(() => formatDecimals(priceProp, paymentCurrency), [priceProp, paymentCurrency])

    const approxUsd = useMemo(() => formatDecimals(approxUsdProp, contractCurrencies.USD), [approxUsdProp])

    if (purchaseStarted) {
        return (
            <ModalPortal>
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.purchaseSummary.started.title')}
                    actions={{
                        back: {
                            title: I18n.t('modal.purchaseSummary.back'),
                            kind: 'link',
                            disabled: true,
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
                    back: {
                        title: I18n.t('modal.purchaseSummary.back'),
                        kind: 'link',
                        onClick: () => onBack(),
                        disabled: !!waiting,
                    },
                    next: {
                        title: I18n.t('modal.purchaseSummary.payNow'),
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
                    <Translate
                        value="modal.purchaseSummary.time"
                        time={time}
                        timeUnit={I18n.t(`common.timeUnit.${timeUnit}`)}
                        className={styles.time}
                    />
                </p>
                <div>
                    <span className={styles.priceValue}>
                        {price}
                        <span className={styles.priceCurrency}>
                            {paymentCurrency}
                        </span>
                    </span>
                    <p className={styles.usdEquiv}>
                        {I18n.t('modal.chooseAccessPeriod.approx')} {approxUsd} {contractCurrencies.USD}
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
    purchaseStarted: false,
}

export default PurchaseSummaryDialog
