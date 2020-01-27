// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import { Translate, I18n } from 'react-redux-i18n'

import CoreText from '$shared/components/Input/StyledText'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import SelectField from '$mp/components/SelectField'
import CurrencySelector from './CurrencySelector'
import { getBalances, getUniswapEquivalents } from '$mp/utils/web3'
import { isMobile } from '$shared/utils/platform'
import { toSeconds } from '$mp/utils/time'
import { dataToUsd, usdToData, formatDecimals } from '$mp/utils/price'
import { timeUnits, contractCurrencies, paymentCurrencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import type { Product } from '$mp/flowtype/product-types'
import type { ContractCurrency, PaymentCurrency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import styles from './chooseAccessPeriod.pcss'

export type Props = {
    dataPerUsd: ?NumberString,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    onNext: (time: NumberString, timeUnit: TimeUnit, paymentCurrency: PaymentCurrency) => Promise<void>,
    onCancel: () => void,
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
    onNext: onNextProp,
    onCancel,
    dataPerUsd,
}: Props) => {
    const [time, setTime] = useState('1')
    const [timeUnit, setTimeUnit] = useState('hour')
    const [paymentCurrency, setPaymentCurrency] = useState(DEFAULT_CURRENCY)
    const [loading, setLoading] = useState(false)
    const [dataBalance, setDataBalance] = useState('-')
    const [ethBalance, setEthBalance] = useState('-')
    const [daiBalance, setDaiBalance] = useState('-')
    const [priceInEth, setPriceInEth] = useState('-')
    const [priceInDai, setPriceInDai] = useState('-')

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

    const { account } = useWeb3Status()

    const isValidTime = useCallback(() => !BN(time).isNaN() && BN(time).isGreaterThan(0), [time])

    const getProductPrices = useCallback(async () => {
        if (isValidTime()) {
            setLoading(true)
            const [ethValue, daiValue] = await getUniswapEquivalents(priceInData)
            setLoading(false)
            setPriceInEth(formatDecimals(ethValue, paymentCurrencies.ETH).toString())
            setPriceInDai(formatDecimals(daiValue, paymentCurrencies.DAI).toString())
        } else {
            setPriceInEth('-')
            setPriceInDai('-')
        }
    }, [isValidTime, priceInData])

    const getAccountBalance = useCallback(async () => {
        setLoading(true)
        const [eth, data, dai] = await getBalances()
        setLoading(false)

        switch (paymentCurrency) {
            case paymentCurrencies.ETH:
                return setEthBalance(formatDecimals(eth, paymentCurrencies.ETH))
            case paymentCurrencies.DATA:
                return setDataBalance(formatDecimals(data, paymentCurrencies.DATA))
            case paymentCurrencies.DAI:
                return setDaiBalance(formatDecimals(dai, paymentCurrencies.DAI))
            default:
                return undefined
        }
    }, [paymentCurrency])

    useEffect(() => {
        getProductPrices()
    }, [getProductPrices])

    useEffect(() => {
        getAccountBalance()
    }, [getAccountBalance, account])

    const currentBalance = () => {
        switch (paymentCurrency) {
            case paymentCurrencies.DATA:
                return dataBalance
            case paymentCurrencies.ETH:
                return ethBalance
            case paymentCurrencies.DAI:
                return daiBalance
            default:
                return dataBalance
        }
    }

    const price = () => {
        switch (paymentCurrency) {
            case paymentCurrencies.DATA:
                return priceInData
            case paymentCurrencies.ETH:
                return priceInEth
            case paymentCurrencies.DAI:
                return priceInDai
            default:
                return priceInData
        }
    }

    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])

    const onTimeUnitChange = useCallback((t) => {
        setTimeUnit(t)
    }, [])

    const onNext = useCallback(async (selectedTime: NumberString | BN, selectedTimeUnit: TimeUnit, selectedPaymentCurrency: PaymentCurrency) => {
        setLoading(true)

        await onNextProp(selectedTime, selectedTimeUnit, selectedPaymentCurrency)
    }, [onNextProp])

    const onPaymentCurrencyChange = useCallback((currency: PaymentCurrency) => (setPaymentCurrency(currency)), [setPaymentCurrency])

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={isMobile ? I18n.t('modal.chooseAccessPeriod.mobileTitle') : I18n.t('modal.chooseAccessPeriod.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: onCancel,
                        kind: 'link',
                    },
                    next: {
                        title: I18n.t('modal.common.next'),
                        kind: 'primary',
                        outline: true,
                        onClick: () => onNext(time, timeUnit, paymentCurrency),
                        disabled: !isValidTime() || loading,
                    },
                }}
                contentClassName={styles.noPadding}
            >
                <div className={styles.root}>
                    <div className={styles.accessPeriod}>
                        <CoreText
                            type="number"
                            value={isValidTime() ? time : ''}
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
                    <div className={styles.balanceAndPrice}>
                        <span className={styles.balance}>
                            <span className={styles.balanceValue}>
                                {currentBalance()}
                            </span>
                            <span className={styles.balanceLabel}>
                                {I18n.t('modal.chooseAccessPeriod.balance')}
                            </span>
                        </span>
                        <span className={styles.priceValue}>
                            {price()}
                            <span className={styles.priceCurrency}>
                                {paymentCurrency}
                            </span>
                        </span>
                        <span className={styles.usdEquiv}>
                            {I18n.t('modal.chooseAccessPeriod.approx')} {priceInUsd} {contractCurrencies.USD}
                        </span>
                    </div>
                    <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
                    <CurrencySelector
                        onChange={(c) => onPaymentCurrencyChange(c)}
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
