// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import type { TimeUnit, PaymentCurrency, NumberString } from '$shared/flowtype/common-types'
import { paymentCurrencies, contractCurrencies } from '$shared/utils/constants'
import { formatDecimals, dataToUsd } from '$mp/utils/price'
import { isMobile } from '$shared/utils/platform'

import styles from './purchaseSummaryDialog.pcss'

export type Props = {
    name: string,
    time: string,
    timeUnit: TimeUnit,
    price: BN,
    ethPrice: BN,
    daiPrice: BN,
    dataPerUsd: NumberString,
    ethPriceInUsd: NumberString,
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
    dataPerUsd,
    ethPriceInUsd,
    purchaseStarted,
    onCancel,
    onPay,
    paymentCurrency,
}: Props) => {
    const priceInChosenCurrency = () => {
        if (paymentCurrency === paymentCurrencies.ETH) {
            return formatDecimals(ethPrice, paymentCurrencies.ETH)
        } else if (paymentCurrency === paymentCurrencies.DAI) {
            return formatDecimals(daiPrice, paymentCurrencies.DAI)
        }
        return formatDecimals(price, paymentCurrencies.DATA)
    }

    const approxUsd = () => {
        if (paymentCurrency === paymentCurrencies.ETH) {
            return ethPriceInUsd
        } else if (paymentCurrency === paymentCurrencies.DAI) {
            return daiPrice
        }
        return formatDecimals(dataToUsd(price, dataPerUsd), contractCurrencies.USD)
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
                        title: isMobile() ? I18n.t('modal.purchaseSummary.back') : I18n.t('modal.common.cancel'),
                        kind: 'link',
                        onClick: onCancel,
                    },
                    next: {
                        title: I18n.t('modal.purchaseSummary.payNow'),
                        kind: 'primary',
                        onClick: () => onPay(),
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
                        {priceInChosenCurrency()}
                        <span className={styles.priceCurrency}>
                            {paymentCurrency}
                        </span>
                    </span>
                    <p className={styles.usdEquiv}>
                        {I18n.t('modal.chooseAccessPeriod.approx')} {approxUsd()} {contractCurrencies.USD}
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
