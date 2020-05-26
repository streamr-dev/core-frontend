// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Buttons from '$shared/components/Buttons'
import Text from '$ui/Text'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import SelectField from '$mp/components/SelectField'
import CurrencySelector from './CurrencySelector'
import { uniswapDATAtoETH, uniswapDATAtoDAI, uniswapETHtoDATA } from '$mp/utils/web3'
import { isMobile } from '$shared/utils/platform'
import { toSeconds } from '$mp/utils/time'
import { dataToUsd, usdToData, formatDecimals } from '$mp/utils/price'
import { timeUnits, contractCurrencies, paymentCurrencies, DEFAULT_CURRENCY, MIN_UNISWAP_AMOUNT_USD } from '$shared/utils/constants'
import type { Product } from '$mp/flowtype/product-types'
import type { ContractCurrency, PaymentCurrency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { useDebounced } from '$shared/hooks/wrapCallback'

import styles from './chooseAccessPeriod.pcss'

export type AccessPeriod = {
    time: NumberString,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    priceInEth: ?NumberString,
    priceInDai: ?NumberString,
    priceInEthUsdEquivalent: ?NumberString,
}

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
}

const getPrice = (time: NumberString | BN, timeUnit: TimeUnit, pricePerSecond: BN, currency: ContractCurrency) => {
    if (!BN(time).isNaN() && BN(time).isGreaterThan(0)) {
        if (currency === paymentCurrencies.ETH || currency === paymentCurrencies.DAI) {
            return formatDecimals(toSeconds(time, timeUnit), currency).toString()
        }
        return formatDecimals(toSeconds(time, timeUnit).multipliedBy(pricePerSecond), currency).toString()
    }
    return '-'
}

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

export const ChooseAccessPeriodDialog = ({
    pricePerSecond,
    priceCurrency,
    balances,
    onNext: onNextProp,
    onCancel,
    dataPerUsd,
    disabled,
}: Props) => {
    const [time, setTime] = useState('1')
    const [timeUnit, setTimeUnit] = useState('hour')
    const [paymentCurrency, setPaymentCurrency] = useState(DEFAULT_CURRENCY)
    const [loading, setLoading] = useState(false)
    const [currentPrice, setCurrentPrice] = useState('-')
    const [approxUsd, setApproxUsd] = useState('-')

    const [priceInData, priceInUsd] = useMemo(() => {
        const pricePerSecondInData = priceCurrency === contractCurrencies.DATA ?
            pricePerSecond :
            usdToData(pricePerSecond, dataPerUsd)

        const pricePerSecondInUsd = priceCurrency === contractCurrencies.USD ?
            pricePerSecond :
            dataToUsd(pricePerSecond, dataPerUsd)

        return [
            getPrice(time, timeUnit, pricePerSecondInData, contractCurrencies.DATA),
            getPrice(time, timeUnit, pricePerSecondInUsd, contractCurrencies.USD),
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

    const setExternalPrices = useDebounced(useCallback(async (dataPerUsd_, priceInData_, priceInUsd_, paymentCurrency_) => {
        setLoading(true)

        let price
        let inUsd
        if (paymentCurrency_ === paymentCurrencies.ETH) {
            price = await uniswapDATAtoETH(priceInData_)
            inUsd = await uniswapETHtoDATA(price.toString())
            inUsd.dividedBy(Number(dataPerUsd_) || 1)
        } else if (paymentCurrency_ === paymentCurrencies.DAI) {
            price = await uniswapDATAtoDAI(priceInData_)
            inUsd = price
        } else {
            price = priceInData_
            inUsd = priceInUsd_
        }
        setCurrentPrice(BN(price).isNaN() ? 'N/A' : formatDecimals(price, paymentCurrency_).toString())
        setApproxUsd(BN(inUsd).isNaN() ? 'N/A' : formatDecimals(inUsd, contractCurrencies.USD))

        setLoading(false)
    }, []), 250)

    useEffect(() => {
        setExternalPrices(dataPerUsd, priceInData, priceInUsd, paymentCurrency)
    }, [setExternalPrices, dataPerUsd, priceInData, paymentCurrency, priceInUsd])

    const currentBalance = useMemo(() => (
        (balances && balances[paymentCurrency]) ? formatDecimals(balances[paymentCurrency], paymentCurrency) : '-'
    ), [balances, paymentCurrency])

    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])

    const onTimeUnitChange = useCallback((t) => {
        setTimeUnit(t)
    }, [])

    const onNext = useCallback(async (selectedTime: NumberString | BN, selectedTimeUnit: TimeUnit, selectedPaymentCurrency: PaymentCurrency) => {
        setLoading(true)

        await onNextProp({
            time: selectedTime,
            timeUnit: selectedTimeUnit,
            paymentCurrency: selectedPaymentCurrency,
            priceInEth: '',
            priceInDai: '',
            priceInEthUsdEquivalent: '',
        })
    }, [onNextProp])

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
            onClick: () => onNext(time, timeUnit, paymentCurrency),
            disabled: !isValidTime || !isValidPrice || loading,
        },
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={isMobile() ? I18n.t('modal.chooseAccessPeriod.mobileTitle') : I18n.t('modal.chooseAccessPeriod.title')}
                actions={actions}
                renderActions={() => (
                    <div className={cx(styles.footer, {
                        [styles.onlyButtons]: paymentCurrency === paymentCurrencies.DATA,
                    })}
                    >
                        {!isMobile() && paymentCurrency !== paymentCurrencies.DATA &&
                            <Translate
                                value="modal.chooseAccessPeriod.uniswap"
                                className={styles.uniswapFooter}
                                tag="span"
                                dangerousHTML
                            />}
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
                            {currentPrice}
                            <span className={styles.priceCurrency}>
                                {paymentCurrency}
                            </span>
                        </span>
                        <span className={styles.usdEquiv}>
                            {I18n.t('modal.chooseAccessPeriod.approx')} {approxUsd} {contractCurrencies.USD}
                        </span>
                    </div>
                    <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
                    <CurrencySelector
                        onChange={onPaymentCurrencyChange}
                        paymentCurrency={paymentCurrency}
                    />
                    {isMobile() && paymentCurrency !== paymentCurrencies.DATA ?
                        <Translate
                            value="modal.chooseAccessPeriod.uniswap"
                            className={styles.uniswapMsg}
                            tag="p"
                            dangerousHTML
                        />
                        : null
                    }
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default ChooseAccessPeriodDialog
