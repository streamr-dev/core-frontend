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
import { buyProduct } from '$mp/modules/purchase/actions'
import { transactionStates } from '$shared/utils/constants'
import {
    getAllowance,
    resetAllowanceState,
    setAllowance as setAllowanceToContract,
    resetAllowance as resetAllowanceToContract,
} from '$mp/modules/allowance/actions'
import {
    selectAllowanceOrPendingAllowance,
    selectSettingAllowance,
    selectSetAllowanceTx,
    selectSetAllowanceError,
    selectResettingAllowance,
    selectResetAllowanceTx,
    selectResetAllowanceError,
} from '$mp/modules/allowance/selectors'
import { selectPurchaseTransaction, selectPurchaseStarted } from '$mp/modules/purchase/selectors'
import type { TimeUnit, NumberString } from '$shared/flowtype/common-types'
import { dataForTimeUnits } from '$mp/utils/price'
import { toSeconds } from '$mp/utils/time'
import { validateDataBalanceForPurchase } from '$mp/modules/deprecated/purchaseDialog/actions'
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
    const ethereumIdentities = useSelector(selectEthereumIdentities)
    const dataPerUsd = useSelector(selectDataPerUsd)
    const allowance = BN(useSelector(selectAllowanceOrPendingAllowance))
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
        dispatch(resetAllowanceState())
        dispatch(getAllowance())

        loadContractProduct(productId)
            .then(() => {
                if (isMounted()) {
                    setStep(purchaseFlowSteps.ACCESS_PERIOD)
                }
            })
    }, [dispatch, loadContractProduct, productId, isMounted])

    // Monitor reset allowance state, set error or proceed after receiving the hash
    const resetAllowanceTx = useSelector(selectResetAllowanceTx)
    const resettingAllowance = useSelector(selectResettingAllowance)
    const hasResetAllowanceTx = !!resetAllowanceTx

    useEffect(() => {
        if (step === purchaseFlowSteps.RESET_ALLOWANCE && hasResetAllowanceTx) {
            setStep(purchaseFlowSteps.ALLOWANCE)
        }
    }, [step, hasResetAllowanceTx])

    // Monitor set allowance state, set error or proceed after receiving the hash
    const setAllowanceTx = useSelector(selectSetAllowanceTx)
    const settingAllowance = useSelector(selectSettingAllowance)
    const hasSetAllowanceTx = !!setAllowanceTx

    useEffect(() => {
        if (step === purchaseFlowSteps.ALLOWANCE && hasSetAllowanceTx) {
            setStep(purchaseFlowSteps.SUMMARY)
        }
    }, [step, hasSetAllowanceTx])

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

    // Monitor allowance & reset allowance state error
    const setAllowanceError = useSelector(selectSetAllowanceError)
    const resetAllowanceError = useSelector(selectResetAllowanceError)

    useEffect(() => {
        if (!step || step === purchaseFlowSteps.ACCESS_PERIOD) {
            return
        }
        if (setAllowanceError) {
            setPurchaseError(setAllowanceError)
        } else if (resetAllowanceError) {
            setPurchaseError(setAllowanceError)
        } else {
            setPurchaseError(null)
        }
    }, [step, setAllowanceError, resetAllowanceError])

    const onClose = useCallback(() => {
        api.close(purchaseSucceeded)
    }, [api, purchaseSucceeded])

    const { pricePerSecond, priceCurrency } = contractProduct || {}

    const onSetAccessPeriod = useCallback(async (selectedTime: NumberString | BN, selectedTimeUnit: TimeUnit) => {
        const price = dataForTimeUnits(pricePerSecond, dataPerUsd, priceCurrency, selectedTime, selectedTimeUnit)

        setTime(selectedTime.toString())
        setTimeUnit(selectedTimeUnit)
        setPurchasePrice(price)

        try {
            await validateDataBalanceForPurchase(price)

            if (!isMounted()) { return }

            if (allowance.isLessThan(price)) {
                if (allowance.isGreaterThan(0)) {
                    setStep(purchaseFlowSteps.RESET_ALLOWANCE)
                } else {
                    setStep(purchaseFlowSteps.ALLOWANCE)
                }
            } else {
                setStep(purchaseFlowSteps.SUMMARY)
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [pricePerSecond, priceCurrency, allowance, dataPerUsd, isMounted])

    const onSetAllowance = useCallback(async () => {
        if (!purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        try {
            await validateDataBalanceForPurchase(purchasePrice)

            if (!isMounted()) { return }

            if (BN(allowance).isGreaterThan(0)) {
                await dispatch(resetAllowanceToContract())
            } else {
                await dispatch(setAllowanceToContract(purchasePrice.toString()))
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [dispatch, purchasePrice, allowance, isMounted])

    const onApprovePurchase = useCallback(async () => {
        if (!time || !timeUnit || !purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const subscriptionTimeInSeconds = toSeconds(time, timeUnit)

        try {
            await validateDataBalanceForPurchase(purchasePrice)

            if (!isMounted()) { return }

            await dispatch(buyProduct(productId || '', subscriptionTimeInSeconds))
        } catch (e) {
            setPurchaseError(e)
        }
    }, [productId, dispatch, time, timeUnit, purchasePrice, isMounted])

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
                    requiredEthBalance={purchaseError.getRequiredEthBalance()}
                    currentEthBalance={purchaseError.getCurrentEthBalance()}
                    requiredDataBalance={purchaseError.getRequiredDataBalance()}
                    currentDataBalance={purchaseError.getCurrentDataBalance()}
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
                onNext={onSetAccessPeriod}
            />
        )
    }

    if (step === purchaseFlowSteps.RESET_ALLOWANCE) {
        return (
            <ReplaceAllowanceDialog
                onCancel={onClose}
                onSet={onSetAllowance}
                settingAllowance={resettingAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetAllowance}
                settingAllowance={settingAllowance}
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
                priceCurrency={priceCurrency}
                onCancel={onClose}
                onPay={onApprovePurchase}
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
