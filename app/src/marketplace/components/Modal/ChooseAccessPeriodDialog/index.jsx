// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Buttons from '$shared/components/Buttons'
import Text from '$ui/Text'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import SelectField from '$mp/components/SelectField'
import { uniswapDATAtoETH, uniswapDATAtoDAI, uniswapETHtoDATA } from '$mp/utils/web3'
import { dataToUsd, formatDecimals, dataForTimeUnits } from '$mp/utils/price'
import { timeUnits, contractCurrencies, paymentCurrencies, DEFAULT_CURRENCY, MIN_UNISWAP_AMOUNT_USD } from '$shared/utils/constants'
import type { Product, AccessPeriod } from '$mp/flowtype/product-types'
import type { PaymentCurrency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { useDebounced } from '$shared/hooks/wrapCallback'
import CurrencySelector from './CurrencySelector'

import styles from './chooseAccessPeriod.pcss'

export type Balances = {
    [$Values<typeof paymentCurrencies>]: NumberString,
}

export type Props = {
    dataPerUsd: ?NumberString,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    balances: Balances,
    onNext: (AccessPeriod) => Promise<void>,
    onCancel: () => void,
    disabled?: boolean,
    initialValues?: AccessPeriod,
}

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

/* eslint-disable object-curly-newline */
export const ChooseAccessPeriodDialog = ({
    pricePerSecond,
    priceCurrency,
    balances,
    onNext,
    onCancel,
    dataPerUsd,
    disabled,
    initialValues,
}: Props) => {
    const {
        time: initialTime = '1',
        timeUnit: initialTimeUnit = 'hour',
        paymentCurrency: initialPaymentCurrency = DEFAULT_CURRENCY,
    } = initialValues || {}
    const [time, setTime] = useState(initialTime)
    const [timeUnit, setTimeUnit] = useState(initialTimeUnit)
    const [paymentCurrency, setPaymentCurrency] = useState(initialPaymentCurrency)
    const [loading, setLoading] = useState(false)
    const [currentPrice, setCurrentPrice] = useState('-')
    const [approxUsd, setApproxUsd] = useState('-')

    const [priceInData, priceInUsd] = useMemo(() => {
        const inData = dataForTimeUnits(
            pricePerSecond,
            dataPerUsd,
            priceCurrency,
            time,
            timeUnit,
        )

        return [
            inData,
            dataToUsd(inData, dataPerUsd),
        ]
    }, [dataPerUsd, priceCurrency, pricePerSecond, time, timeUnit])

    const isValidTime = useMemo(() => !BN(time).isNaN() && BN(time).isGreaterThan(0), [time])

    const isValidPrice = useMemo(() => {
        if (paymentCurrency === paymentCurrencies.ETH) {
            if (Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD) { return false }
            return !(BN(currentPrice).isNaN() || !BN(currentPrice).isGreaterThan(0) || !BN(currentPrice).isFinite())
        }

        if (paymentCurrency === paymentCurrencies.DAI) {
            if (Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD) { return false }
            return !(BN(currentPrice).isNaN() || !BN(currentPrice).isGreaterThan(0) || !BN(currentPrice).isFinite())
        }

        return true
    }, [paymentCurrency, priceInUsd, currentPrice])

    const setExternalPrices = useDebounced(useCallback(async ({
        dataPerUsd: perUsd,
        priceInData: inData,
        priceInUsd: inUsd,
        paymentCurrency: currency,
    }) => {
        setLoading(true)

        let price
        let usdEstimate
        if (currency === paymentCurrencies.ETH) {
            price = await uniswapDATAtoETH(inData.toString(), true)
            usdEstimate = await uniswapETHtoDATA(price.toString(), true)
            usdEstimate = usdEstimate.dividedBy(Number(perUsd) || 1)
        } else if (currency === paymentCurrencies.DAI) {
            price = await uniswapDATAtoDAI(inData.toString(), true)
            usdEstimate = price
        } else {
            price = inData
            usdEstimate = inUsd
        }

        setCurrentPrice(price)
        setApproxUsd(usdEstimate)

        setLoading(false)
    }, []), 250)

    const displayPrice = useMemo(() => (
        BN(currentPrice).isNaN() ? 'N/A' : formatDecimals(currentPrice, paymentCurrency)
    ), [currentPrice, paymentCurrency])

    const displayApproxUsd = useMemo(() => (
        BN(approxUsd).isNaN() ? 'N/A' : formatDecimals(approxUsd, contractCurrencies.USD)
    ), [approxUsd])

    useEffect(() => {
        setExternalPrices({
            dataPerUsd,
            priceInData,
            priceInUsd,
            paymentCurrency,
        })
    }, [setExternalPrices, dataPerUsd, priceInData, paymentCurrency, priceInUsd])

    const currentBalance = useMemo(() => (
        (balances && balances[paymentCurrency]) ? formatDecimals(balances[paymentCurrency], paymentCurrency) : '-'
    ), [balances, paymentCurrency])

    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])

    const onTimeUnitChange = useCallback((t) => {
        setTimeUnit(t)
    }, [])

    const onPaymentCurrencyChange = useCallback((currency: PaymentCurrency) => {
        setPaymentCurrency(currency)
    }, [setPaymentCurrency])

    const actions = {
        cancel: {
            title: I18n.t('modal.common.cancel'),
            onClick: () => onCancel(),
            kind: 'link',
        },
        next: {
            title: I18n.t('modal.common.next'),
            kind: 'primary',
            outline: true,
            onClick: () => onNext({
                time,
                timeUnit,
                paymentCurrency,
                price: currentPrice,
                approxUsd,
            }),
            disabled: !isValidTime || !isValidPrice || loading,
        },
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={(
                    <React.Fragment>
                        <Translate value="modal.chooseAccessPeriod.title" className={styles.title} />
                        <Translate value="modal.chooseAccessPeriod.mobileTitle" className={styles.mobileTitle} />
                    </React.Fragment>
                )}
                actions={actions}
                renderActions={() => (
                    <div className={cx(styles.footer, {
                        [styles.onlyButtons]: paymentCurrency === paymentCurrencies.DATA,
                    })}
                    >
                        {paymentCurrency !== paymentCurrencies.DATA && (
                            <Translate
                                value="modal.chooseAccessPeriod.uniswap"
                                className={styles.uniswapFooter}
                                tag="span"
                                dangerousHTML
                            />
                        )}
                        <Buttons
                            actions={actions}
                        />
                    </div>
                )}
                contentClassName={styles.noPadding}
                disabled={disabled}
            >
                <div className={styles.root}>
                    <div className={styles.accessPeriod}>
                        <div className={styles.timeValueInput}>
                            <Text
                                type="number"
                                value={isValidTime ? time : ''}
                                invalid={!isValidTime || !isValidPrice}
                                onChange={(e: SyntheticInputEvent<EventTarget>) => setTime(e.target.value)}
                                className={styles.accessPeriodNumber}
                            />
                            <SelectField
                                placeholder="Select"
                                options={options}
                                value={selectedValue}
                                onChange={({ value: nextValue }) => onTimeUnitChange(nextValue)}
                                className={styles.accessPeriodUnit}
                            />
                        </div>
                        {(!isValidTime || !isValidPrice) &&
                        paymentCurrency !== paymentCurrencies.DATA &&
                        currentPrice !== '-' && // prevent false positives during load
                        (
                            <Errors theme={MarketplaceTheme} className={styles.uniswapErrors}>
                                {!isValidTime &&
                                    <React.Fragment>
                                        <Translate
                                            value="modal.chooseAccessPeriod.invalidTime"
                                            className={styles.invalidInputDesktop}
                                            tag="p"
                                            dangerousHTML
                                        />
                                    </React.Fragment>
                                }

                                {!isValidPrice && Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD &&
                                    <React.Fragment>
                                        <Translate
                                            value="modal.chooseAccessPeriod.lowPriceDesktop"
                                            className={styles.invalidInputDesktop}
                                            tag="p"
                                            dangerousHTML
                                        />
                                        <Translate
                                            value="modal.chooseAccessPeriod.lowPriceMobile"
                                            className={styles.invalidInputMobile}
                                            tag="p"
                                            dangerousHTML
                                        />
                                    </React.Fragment>
                                }
                                {!isValidPrice && Number(priceInUsd) > MIN_UNISWAP_AMOUNT_USD &&
                                    <React.Fragment>
                                        <Translate
                                            value="modal.chooseAccessPeriod.highPriceDesktop"
                                            className={styles.invalidInputDesktop}
                                            tag="p"
                                            dangerousHTML
                                        />
                                        <Translate
                                            value="modal.chooseAccessPeriod.highPriceMobile"
                                            className={styles.invalidInputMobile}
                                            tag="p"
                                            dangerousHTML
                                        />
                                    </React.Fragment>
                                }
                            </Errors>
                        )}
                    </div>
                    <div className={styles.balanceAndPrice}>
                        <span className={styles.balance}>
                            <span className={styles.balanceValue}>
                                {currentBalance}
                            </span>
                            <span className={styles.balanceLabel}>
                                {I18n.t('modal.chooseAccessPeriod.balance')}
                            </span>
                        </span>
                        <span className={styles.priceValue}>
                            {displayPrice}
                            <span className={styles.priceCurrency}>
                                {paymentCurrency}
                            </span>
                        </span>
                        <span className={styles.usdEquiv}>
                            {I18n.t('modal.chooseAccessPeriod.approx')} {displayApproxUsd} {contractCurrencies.USD}
                        </span>
                    </div>
                    <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
                    <CurrencySelector
                        onChange={onPaymentCurrencyChange}
                        paymentCurrency={paymentCurrency}
                    />
                    {paymentCurrency !== paymentCurrencies.DATA && (
                        <Translate
                            value="modal.chooseAccessPeriod.uniswap"
                            className={styles.uniswapMsg}
                            tag="p"
                            dangerousHTML
                        />
                    )}
                </div>
            </Dialog>
        </ModalPortal>
    )
}
/* eslint-enable object-curly-newline */

export default ChooseAccessPeriodDialog
