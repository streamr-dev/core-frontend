import { $Values, $ElementType } from 'utility-types'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import cx from 'classnames'
import { useDebouncedCallback } from 'use-debounce'
import Buttons from '$shared/components/Buttons'
import Text from '$ui/Text'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import SelectField from '$mp/components/SelectField'
import { uniswapDATAtoETH, uniswapDATAtoDAI, uniswapETHtoDATA, getDataAddress } from '$mp/utils/web3'
import { priceForTimeUnits } from '$mp/utils/price'
import { timeUnits, contractCurrencies, paymentCurrencies, DEFAULT_CURRENCY, MIN_UNISWAP_AMOUNT_USD } from '$shared/utils/constants'
import type { Product, AccessPeriod } from '$mp/types/product-types'
import type { PaymentCurrency, NumberString, TimeUnit } from '$shared/types/common-types'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { getUsdRate } from '$shared/utils/coingecko'
import { fromDecimals } from '$mp/utils/math'
import CurrencySelector from './CurrencySelector'
import styles from './chooseAccessPeriod.pcss'
export type Balances = Record<$Values<typeof paymentCurrencies>, NumberString>
export type Props = {
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>
    pricingTokenAddress: $ElementType<Product, 'pricingTokenAddress'>
    pricingTokenDecimals: $ElementType<Product, 'pricingTokenDecimals'>
    tokenSymbol: string
    chainId: number
    balances: Balances
    onNext: (arg0: AccessPeriod) => Promise<void>
    onCancel: () => void
    disabled?: boolean
    initialValues?: AccessPeriod
}
const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

/* eslint-disable object-curly-newline */
export const ChooseAccessPeriodDialog = ({
    pricePerSecond,
    pricingTokenAddress,
    pricingTokenDecimals,
    tokenSymbol,
    chainId,
    balances,
    onNext,
    onCancel,
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
    const [priceInUsd, setPriceInUsd] = useState(null)
    const availableCurrencies = useMemo(() => {
        if (pricingTokenAddress === getDataAddress(chainId)) {
            return [paymentCurrencies.DATA]
        }

        return [paymentCurrencies.PRODUCT_DEFINED]
    }, [pricingTokenAddress, chainId])
    const priceInToken = useMemo(() => {
        const price = priceForTimeUnits(pricePerSecond, time, timeUnit)
        return price
    }, [pricePerSecond, time, timeUnit])
    useEffect(() => {
        const load = async () => {
            const rate = await getUsdRate(pricingTokenAddress, chainId)

            if (rate !== 0 && currentPrice !== '-') {
                setPriceInUsd(currentPrice * rate)
            }
        }

        load()
    }, [currentPrice, pricingTokenAddress, chainId])
    const isValidTime = useMemo(() => !BN(time).isNaN() && BN(time).isGreaterThan(0), [time])
    const isValidPrice = useMemo(() => {
        if (paymentCurrency === paymentCurrencies.NATIVE) {
            if (Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD) {
                return false
            }

            return !(BN(currentPrice).isNaN() || !BN(currentPrice).isGreaterThan(0) || !BN(currentPrice).isFinite())
        }

        if (paymentCurrency === paymentCurrencies.DAI) {
            if (Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD) {
                return false
            }

            return !(BN(currentPrice).isNaN() || !BN(currentPrice).isGreaterThan(0) || !BN(currentPrice).isFinite())
        }

        return true
    }, [paymentCurrency, priceInUsd, currentPrice])
    const setExternalPrices = useDebouncedCallback(async ({ priceInToken: inToken, priceInUsd: inUsd, paymentCurrency: currency }) => {
        setLoading(true)
        let price
        let usdEstimate

        if (currency === paymentCurrencies.NATIVE) {
            price = await uniswapDATAtoETH(inToken.toString(), true)
            usdEstimate = await uniswapETHtoDATA(price.toString(), true)
        } else if (currency === paymentCurrencies.DAI) {
            price = await uniswapDATAtoDAI(inToken.toString(), true)
            usdEstimate = price
        } else {
            price = inToken
            usdEstimate = inUsd
        }

        setCurrentPrice(fromDecimals(price, pricingTokenDecimals))
        setApproxUsd(usdEstimate)
        setLoading(false)
    }, 250)
    const displayPrice = useMemo(() => (BN(currentPrice).isNaN() ? 'N/A' : BN(currentPrice).toFixed(2)), [currentPrice])
    const displayApproxUsd = useMemo(() => (BN(approxUsd).isNaN() ? 'N/A' : BN(approxUsd).toFixed(2)), [approxUsd])
    useEffect(() => {
        setExternalPrices({
            priceInToken,
            priceInUsd,
            paymentCurrency,
        })
    }, [setExternalPrices, priceInToken, paymentCurrency, priceInUsd])
    const currentBalance = useMemo(
        () => (balances && balances[paymentCurrency] ? BN(balances[paymentCurrency]).toFixed(2) : '-'),
        [balances, paymentCurrency],
    )
    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])
    const onTimeUnitChange = useCallback((t) => {
        setTimeUnit(t)
    }, [])
    const onPaymentCurrencyChange = useCallback(
        (currency: PaymentCurrency) => {
            setPaymentCurrency(currency)
        },
        [setPaymentCurrency],
    )
    const actions = {
        cancel: {
            title: 'Cancel',
            onClick: () => onCancel(),
            kind: 'link',
        },
        next: {
            title: 'Next',
            kind: 'primary',
            outline: true,
            onClick: () =>
                onNext({
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
                title={
                    <React.Fragment>
                        <span className={styles.title}>Choose your access period &amp; payment token</span>
                        <span className={styles.mobileTitle}>Choose your access period</span>
                    </React.Fragment>
                }
                actions={actions}
                renderActions={() => (
                    <div
                        className={cx(styles.footer, {
                            [styles.onlyButtons]: !(paymentCurrency === paymentCurrencies.NATIVE || paymentCurrency === paymentCurrencies.DAI),
                        })}
                    >
                        {(paymentCurrency === paymentCurrencies.NATIVE || paymentCurrency === paymentCurrencies.DAI) && (
                            <span className={styles.uniswapFooter}>Exchange via Uniswap</span>
                        )}
                        <Buttons actions={actions} />
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
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setTime(e.target.value)}
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
                            currentPrice !== '-' && ( // prevent false positives during load
                            <Errors theme={MarketplaceTheme} className={styles.uniswapErrors}>
                                {!isValidTime && <p className={styles.invalidInputDesktop}>Access period must be a number</p>}
                                {!isValidPrice && Number(priceInUsd) < MIN_UNISWAP_AMOUNT_USD && (
                                    <React.Fragment>
                                        <p className={styles.invalidInputDesktop}>
                                            Transaction too small for Uniswap. Please try a longer period.
                                        </p>
                                        <p className={styles.invalidInputMobile}>Transaction too small. Please try a longer period.</p>
                                    </React.Fragment>
                                )}
                                {!isValidPrice && Number(priceInUsd) > MIN_UNISWAP_AMOUNT_USD && (
                                    <React.Fragment>
                                        <p className={styles.invalidInputDesktop}>
                                            Transaction too large for Uniswap. Please try a shorter period.
                                        </p>
                                        <p className={styles.invalidInputMobile}>Transaction too large. Please try a shorter period.</p>
                                    </React.Fragment>
                                )}
                            </Errors>
                        )}
                    </div>
                    <div className={styles.balanceAndPrice}>
                        <span className={styles.balance}>
                            <span className={styles.balanceValue}>{currentBalance}</span>
                            <span className={styles.balanceLabel}>Balance</span>
                        </span>
                        <span className={styles.priceValue}>
                            {displayPrice}
                            <span className={styles.priceCurrency}>{tokenSymbol}</span>
                        </span>
                        <span className={styles.usdEquiv}>
                            Approx {displayApproxUsd} {contractCurrencies.USD}
                        </span>
                    </div>
                    <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
                    <CurrencySelector
                        onChange={onPaymentCurrencyChange}
                        paymentCurrency={paymentCurrency}
                        availableCurrencies={availableCurrencies}
                        tokenSymbol={tokenSymbol}
                    />
                    {(paymentCurrency === paymentCurrencies.NATIVE || paymentCurrency === paymentCurrencies.DAI) && (
                        <p className={styles.uniswapMsg}>Exchange via Uniswap</p>
                    )}
                </div>
            </Dialog>
        </ModalPortal>
    )
}
/* eslint-enable object-curly-newline */

export default ChooseAccessPeriodDialog
