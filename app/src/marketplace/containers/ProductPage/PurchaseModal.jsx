// @flow

import React, { useEffect, useCallback, useState, useMemo } from 'react'
import BN from 'bignumber.js'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { ProductId } from '$mp/flowtype/product-types'

import useModal from '$shared/hooks/useModal'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import { useController } from '$mp/containers/ProductController'
import { usePending } from '$shared/hooks/usePending'
import { purchaseFlowSteps } from '$mp/utils/constants'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import { selectProduct } from '$mp/modules/product/selectors'
import { selectContractProduct, selectContractProductError } from '$mp/modules/contractProduct/selectors'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import { buyProduct, clearPurchaseState } from '$mp/modules/purchase/actions'
import { transactionStates, DEFAULT_CURRENCY, paymentCurrencies } from '$shared/utils/constants'
import {
    getDataAllowance,
    resetDataAllowanceState,
    setDataAllowance as setDataAllowanceToContract,
    resetDataAllowance as resetDataAllowanceToContract,
    getDaiAllowance,
    resetDaiAllowanceState,
    setDaiAllowance as setDaiAllowanceToContract,
    resetDaiAllowance as resetDaiAllowanceToContract,
} from '$mp/modules/allowance/actions'
import {
    selectDataAllowanceOrPendingDataAllowance,
    selectSettingDataAllowance,
    selectSetDataAllowanceTx,
    selectSetDataAllowanceError,
    selectResettingDataAllowance,
    selectResetDataAllowanceTx,
    selectResetDataAllowanceError,
    selectDaiAllowanceOrPendingDaiAllowance,
    selectSettingDaiAllowance,
    selectSetDaiAllowanceTx,
    selectSetDaiAllowanceError,
    selectResettingDaiAllowance,
    selectResetDaiAllowanceTx,
    selectResetDaiAllowanceError,
} from '$mp/modules/allowance/selectors'
import { selectPurchaseTransaction, selectPurchaseStarted } from '$mp/modules/purchase/selectors'
import type { TimeUnit, NumberString, PaymentCurrency } from '$shared/flowtype/common-types'
import { dataForTimeUnits } from '$mp/utils/price'
import { toSeconds } from '$mp/utils/time'
import { validateBalanceForPurchase, getUniswapEquivalents } from '$mp/utils/web3'
import NoBalanceError from '$mp/errors/NoBalanceError'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog from '$mp/components/Modal/ChooseAccessPeriodDialog'
import useIsMounted from '$shared/hooks/useIsMounted'

import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'

type Props = {
    productId: ProductId,
    api: Object,
}

export const PurchaseDialog = ({ productId, api }: Props) => {
    const dispatch = useDispatch()
    const { loadContractProduct } = useController()
    const { web3Error, checkingWeb3, account } = useWeb3Status()
    const { isPending } = usePending('contractProduct.LOAD')
    const [step, setStep] = useState(null)
    const [purchaseError, setPurchaseError] = useState(null)
    const [purchaseSucceeded, setPurchaseSucceeded] = useState(false)
    const [time, setTime] = useState('1')
    const [timeUnit, setTimeUnit] = useState('hour')
    const [purchasePrice, setPurchasePrice] = useState(undefined)
    const [ethPrice, setEthPrice] = useState(undefined)
    const [daiPrice, setDaiPrice] = useState(undefined)
    const [paymentCurrency, setPaymentCurrency] = useState(DEFAULT_CURRENCY)
    const ethereumIdentities = useSelector(selectEthereumIdentities)
    const dataPerUsd = useSelector(selectDataPerUsd)
    const dataAllowance = BN(useSelector(selectDataAllowanceOrPendingDataAllowance))
    const daiAllowance = BN(useSelector(selectDaiAllowanceOrPendingDaiAllowance))
    const product = useSelector(selectProduct)
    const isMounted = useIsMounted()
    const contractProduct = useSelector(selectContractProduct)
    const contractProductError = useSelector(selectContractProductError)

    // Check if current metamask account is linked to Streamr account
    const accountLinked = useMemo(() => (
        !!(ethereumIdentities &&
        account &&
        ethereumIdentities.find(({ json }) =>
            json && json.address && areAddressesEqual(json.address, account))
        )
    ), [ethereumIdentities, account])

    // Start loading the contract product & clear allowance state
    useEffect(() => {
        dispatch(resetDataAllowanceState())
        dispatch(getDataAllowance())
        dispatch(resetDaiAllowanceState())
        dispatch(getDaiAllowance())
        dispatch(clearPurchaseState())

        loadContractProduct(productId)
            .then(() => {
                if (isMounted()) {
                    setStep(purchaseFlowSteps.ACCESS_PERIOD)
                }
            })
    }, [dispatch, loadContractProduct, productId, isMounted])

    // Monitor reset DATA allowance state, set error or proceed after receiving the hash
    const resetDataAllowanceTx = useSelector(selectResetDataAllowanceTx)
    const resettingDataAllowance = useSelector(selectResettingDataAllowance)
    const hasResetDataAllowanceTx = !!resetDataAllowanceTx

    // Monitor reset DAI allowance state, set error or proceed after receiving the hash
    const resetDaiAllowanceTx = useSelector(selectResetDaiAllowanceTx)
    const resettingDaiAllowance = useSelector(selectResettingDaiAllowance)
    const hasResetDaiAllowanceTx = !!resetDaiAllowanceTx

    useEffect(() => {
        if (step === purchaseFlowSteps.RESET_DATA_ALLOWANCE && hasResetDataAllowanceTx) {
            setStep(purchaseFlowSteps.DATA_ALLOWANCE)
        }
    }, [step, hasResetDataAllowanceTx])

    useEffect(() => {
        if (step === purchaseFlowSteps.RESET_DAI_ALLOWANCE && hasResetDaiAllowanceTx) {
            setStep(purchaseFlowSteps.DAI_ALLOWANCE)
        }
    }, [step, hasResetDaiAllowanceTx])

    // Monitor set DATA allowance state, set error or proceed after receiving the hash
    const setDataAllowanceTx = useSelector(selectSetDataAllowanceTx)
    const settingDataAllowance = useSelector(selectSettingDataAllowance)
    const hasSetDataAllowanceTx = !!setDataAllowanceTx

    // Monitor set DAI allowance state, set error or proceed after receiving the hash
    const setDaiAllowanceTx = useSelector(selectSetDaiAllowanceTx)
    const settingDaiAllowance = useSelector(selectSettingDaiAllowance)
    const hasSetDaiAllowanceTx = !!setDaiAllowanceTx

    useEffect(() => {
        if (step === purchaseFlowSteps.DATA_ALLOWANCE && hasSetDataAllowanceTx) {
            setStep(purchaseFlowSteps.SUMMARY)
        }
    }, [step, hasSetDataAllowanceTx])

    useEffect(() => {
        if (step === purchaseFlowSteps.DAI_ALLOWANCE && hasSetDaiAllowanceTx) {
            setStep(purchaseFlowSteps.SUMMARY)
        }
    }, [step, hasSetDaiAllowanceTx])

    // Monitor purchase transaction
    const purchaseTransaction = useSelector(selectPurchaseTransaction)
    const hasPurchaseTransaction = !!purchaseTransaction
    const purchaseStarted = useSelector(selectPurchaseStarted)
    const purchaseState = purchaseTransaction && purchaseTransaction.state

    useEffect(() => {
        if (step === purchaseFlowSteps.SUMMARY && hasPurchaseTransaction) {
            setStep(purchaseFlowSteps.COMPLETE)
        }
    }, [step, hasPurchaseTransaction])

    useEffect(() => {
        setPurchaseSucceeded(!!(step === purchaseFlowSteps.COMPLETE && purchaseState === transactionStates.CONFIRMED))
    }, [step, purchaseState])

    // Monitor DATA & DAI allowances & reset allowance state error
    const setDataAllowanceError = useSelector(selectSetDataAllowanceError)
    const resetDataAllowanceError = useSelector(selectResetDataAllowanceError)
    const setDaiAllowanceError = useSelector(selectSetDaiAllowanceError)
    const resetDaiAllowanceError = useSelector(selectResetDaiAllowanceError)

    useEffect(() => {
        if (!step || step === purchaseFlowSteps.ACCESS_PERIOD) {
            return
        }
        if (setDataAllowanceError) {
            setPurchaseError(setDataAllowanceError)
        } else if (resetDataAllowanceError) {
            setPurchaseError(setDataAllowanceError)
        } else {
            setPurchaseError(null)
        }
    }, [step, setDataAllowanceError, resetDataAllowanceError])

    useEffect(() => {
        if (!step || step === purchaseFlowSteps.ACCESS_PERIOD) {
            return
        }
        if (setDaiAllowanceError) {
            setPurchaseError(setDaiAllowanceError)
        } else if (resetDaiAllowanceError) {
            setPurchaseError(setDaiAllowanceError)
        } else {
            setPurchaseError(null)
        }
    }, [step, setDaiAllowanceError, resetDaiAllowanceError])

    const onClose = useCallback(() => {
        api.close(purchaseSucceeded)
    }, [api, purchaseSucceeded])

    const { pricePerSecond, priceCurrency } = contractProduct || {}

    const onSetAccessPeriodAndCurrency =
        useCallback(async (selectedTime: NumberString | BN, selectedTimeUnit: TimeUnit, selectedCurrency: PaymentCurrency) => {
            const price = dataForTimeUnits(pricePerSecond, dataPerUsd, priceCurrency, selectedTime, selectedTimeUnit)
            const [ethVal, daiVal] = await getUniswapEquivalents(price.toString())

            setTime(selectedTime.toString())
            setTimeUnit(selectedTimeUnit)
            setPurchasePrice(price)
            setPaymentCurrency(selectedCurrency)
            setEthPrice(ethVal)
            setDaiPrice(daiVal)

            try {
                await validateBalanceForPurchase(price, selectedCurrency)

                if (!isMounted()) { return }

                switch (selectedCurrency) {
                    case paymentCurrencies.ETH:
                        setStep(purchaseFlowSteps.SUMMARY)
                        break

                    // eslint-disable-next-line no-case-declarations
                    case paymentCurrencies.DAI:
                        const daiPurchasePrice = daiVal.toString()
                        if (daiAllowance.isLessThan(daiPurchasePrice)) {
                            if (daiAllowance.isGreaterThan(0)) {
                                setStep(purchaseFlowSteps.RESET_DAI_ALLOWANCE)
                            } else {
                                setStep(purchaseFlowSteps.DAI_ALLOWANCE)
                            }
                        } else {
                            setStep(purchaseFlowSteps.SUMMARY)
                        }
                        break

                    default: // Pay w DATA
                        if (dataAllowance.isLessThan(price)) {
                            if (dataAllowance.isGreaterThan(0)) {
                                setStep(purchaseFlowSteps.RESET_DATA_ALLOWANCE)
                            } else {
                                setStep(purchaseFlowSteps.DATA_ALLOWANCE)
                            }
                        } else {
                            setStep(purchaseFlowSteps.SUMMARY)
                        }
                        break
                }
            } catch (e) {
                setPurchaseError(e)
            }
        }, [pricePerSecond, dataPerUsd, priceCurrency, isMounted, daiAllowance, dataAllowance])

    const onSetDataAllowance = useCallback(async () => {
        if (!purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        try {
            await validateBalanceForPurchase(purchasePrice, paymentCurrency)

            if (!isMounted()) { return }

            if (BN(dataAllowance).isGreaterThan(0)) {
                await dispatch(resetDataAllowanceToContract())
            } else {
                await dispatch(setDataAllowanceToContract(purchasePrice.toString()))
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [purchasePrice, paymentCurrency, isMounted, dataAllowance, dispatch])

    const onSetDaiAllowance = useCallback(async () => {
        if (!purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        try {
            await validateBalanceForPurchase(purchasePrice, paymentCurrency)

            if (!isMounted()) { return }

            if (BN(daiAllowance).isGreaterThan(0)) {
                await dispatch(resetDaiAllowanceToContract())
            } else {
                const daiPurchasePrice = (await getUniswapEquivalents(purchasePrice.toString()))[1].toString()

                await dispatch(setDaiAllowanceToContract(daiPurchasePrice))
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [purchasePrice, paymentCurrency, isMounted, daiAllowance, dispatch])

    const onApprovePurchase = useCallback(async () => {
        if (!time || !timeUnit || !purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const subscriptionTimeInSeconds = toSeconds(time, timeUnit)

        try {
            await validateBalanceForPurchase(purchasePrice, paymentCurrency)
            const [ethPurchasePrice, daiPurchasePrice] = await getUniswapEquivalents(purchasePrice.toString())

            if (!isMounted()) { return }

            await dispatch(buyProduct(productId || '', subscriptionTimeInSeconds, paymentCurrency, ethPurchasePrice, daiPurchasePrice))
        } catch (e) {
            setPurchaseError(e)
        }
    }, [time, timeUnit, purchasePrice, paymentCurrency, isMounted, dispatch, productId])

    if (isPending || checkingWeb3 || web3Error) {
        return (
            <Web3ErrorDialog
                waiting={isPending || checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    if (purchaseError || contractProductError) {
        if (purchaseError instanceof NoBalanceError) {
            return (
                <NoBalanceDialog
                    onCancel={onClose}
                    requiredGasBalance={purchaseError.getRequiredGasBalance()}
                    requiredEthBalance={purchaseError.getRequiredEthBalance()}
                    currentEthBalance={purchaseError.getCurrentEthBalance()}
                    requiredDataBalance={purchaseError.getRequiredDataBalance()}
                    currentDataBalance={purchaseError.getCurrentDataBalance()}
                    currentDaiBalance={purchaseError.getCurrentDaiBalance()}
                    requiredDaiBalance={purchaseError.getRequiredDaiBalance()}
                    paymentCurrency={paymentCurrency}
                />
            )
        }

        return (
            <ErrorDialog
                title={I18n.t('purchaseDialog.errorTitle')}
                message={(purchaseError || contractProductError).message}
                onClose={onClose}
            />
        )
    }

    if (step === purchaseFlowSteps.ACCESS_PERIOD) {
        return (
            <ChooseAccessPeriodDialog
                dataPerUsd={dataPerUsd}
                pricePerSecond={pricePerSecond}
                priceCurrency={priceCurrency}
                onCancel={onClose}
                onNext={onSetAccessPeriodAndCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.RESET_DATA_ALLOWANCE) {
        return (
            <ReplaceAllowanceDialog
                onCancel={onClose}
                onSet={onSetDataAllowance}
                settingDataAllowance={resettingDataAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.DATA_ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetDataAllowance}
                settingDataAllowance={settingDataAllowance}
                paymentCurrency={paymentCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.RESET_DAI_ALLOWANCE) {
        return (
            <ReplaceAllowanceDialog
                onCancel={onClose}
                onSet={onSetDaiAllowance}
                settingDaiAllowance={resettingDaiAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.DAI_ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetDaiAllowance}
                settingDaiAllowance={settingDaiAllowance}
                paymentCurrency={paymentCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.SUMMARY) {
        return (
            <PurchaseSummaryDialog
                purchaseStarted={purchaseStarted}
                name={product.name}
                time={time}
                timeUnit={timeUnit}
                price={purchasePrice}
                ethPrice={ethPrice}
                daiPrice={daiPrice}
                dataPerUsd={dataPerUsd}
                onCancel={onClose}
                onPay={onApprovePurchase}
                paymentCurrency={paymentCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.COMPLETE) {
        return (
            <CompletePurchaseDialog
                onCancel={onClose}
                purchaseState={purchaseState}
                accountLinked={accountLinked}
            />
        )
    }

    return null
}

export default () => {
    const { isOpen, api, value } = useModal('purchase')

    if (!isOpen) {
        return null
    }

    const { productId } = value || {}

    return (
        <PurchaseDialog
            productId={productId}
            api={api}
        />
    )
}
