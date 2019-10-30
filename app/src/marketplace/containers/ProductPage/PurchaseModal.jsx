// @flow

import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BN from 'bignumber.js'
import { useSelector } from 'react-redux'
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
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import { selectAllowanceOrPendingAllowance } from '$mp/modules/allowance/selectors'
import type { TimeUnit, NumberString } from '$shared/flowtype/common-types'
import { dataForTimeUnits } from '$mp/utils/price'
import { validateDataBalanceForPurchase } from '$mp/modules/deprecated/purchaseDialog/actions'
import NoBalanceError from '$mp/errors/NoBalanceError'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog from '$mp/components/Modal/ChooseAccessPeriodDialog'

import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'

type Props = {
    productId: ProductId,
    api: Object,
}

export const PurchaseDialog = ({ productId, api }: Props) => {
    const { loadContractProduct } = useController()
    const { web3Error, checkingWeb3, account } = useWeb3Status()
    const { isPending } = usePending('contractProduct.LOAD')
    const [step, setStep] = useState(null)
    const [purchaseError, setPurchaseError] = useState(null)
    const [purchaseSucceeded, setPurchaseSucceeded] = useState(false)
    const [accessPeriod, setAccessPeriod] = useState({})
    const ethereumIdentities = useSelector(selectEthereumIdentities)
    const dataPerUsd = useSelector(selectDataPerUsd)
    const allowance = BN(useSelector(selectAllowanceOrPendingAllowance))
    const product = useSelector(selectProduct)
    const contractProduct = useSelector(selectContractProduct)
    const contractProductRef = useRef(undefined)
    contractProductRef.current = contractProduct

    const accountLinked = useMemo(() => (
        !!(ethereumIdentities &&
        account &&
        ethereumIdentities.find(({ json }) =>
            json && json.address && areAddressesEqual(json.address, account))
        )
    ), [ethereumIdentities, account])

    useEffect(() => {
        loadContractProduct(productId)
            .then(() => {
                setStep(purchaseFlowSteps.ACCESS_PERIOD)
            })
    }, [loadContractProduct, productId])

    const onClose = useCallback(() => {
        api.close(purchaseSucceeded)
    }, [api, purchaseSucceeded])

    const onSetAccessPeriod = useCallback(async (time: NumberString | BN, timeUnit: TimeUnit) => {
        if (!contractProductRef.current) {
            throw new Error(I18n.t('error.noProduct'))
        }

        setAccessPeriod({
            time: time.toString(),
            timeUnit,
        })

        // Check if allowance is needed
        const { pricePerSecond, priceCurrency } = contractProductRef.current || {}

        const price = dataForTimeUnits(pricePerSecond, dataPerUsd, priceCurrency, time, timeUnit)

        try {
            await validateDataBalanceForPurchase(price)

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
    }, [contractProductRef, allowance, dataPerUsd])

    const onSetAllowance = () => {}
    const gettingAllowance = false
    const resettingAllowance = false
    const settingAllowance = false
    const purchaseStarted = false
    const purchase = () => {}
    const onApprovePurchase = () => {}
    const purchaseTransaction = {}

    if (isPending || checkingWeb3 || web3Error) {
        return (
            <Web3ErrorDialog
                waiting={isPending || checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    if (purchaseError) {
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
                message={purchaseError.message}
                onClose={onClose}
            />
        )
    }

    if (step === purchaseFlowSteps.ACCESS_PERIOD) {
        return (
            <ChooseAccessPeriodDialog
                dataPerUsd={dataPerUsd}
                contractProduct={contractProduct}
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
                gettingAllowance={gettingAllowance}
                settingAllowance={resettingAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetAllowance}
                gettingAllowance={gettingAllowance}
                settingAllowance={settingAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.SUMMARY) {
        return (
            <PurchaseSummaryDialog
                purchaseStarted={purchaseStarted}
                product={product}
                contractProduct={contractProduct}
                purchase={purchase}
                onCancel={onClose}
                onPay={onApprovePurchase}
            />
        )
    }

    if (step === purchaseFlowSteps.COMPLETE) {
        return (
            <CompletePurchaseDialog
                onCancel={onClose}
                purchaseState={purchaseTransaction && purchaseTransaction.state}
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
