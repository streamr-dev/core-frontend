// @flow

import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BN from 'bignumber.js'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { ProductId } from '$mp/flowtype/product-types'

import useModal from '$shared/hooks/useModal'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import { useController } from '$mp/containers/ProductController'
import { usePending } from '$shared/hooks/usePending'
import { purchaseFlowSteps } from '$mp/utils/constants'
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
import { dataForTimeUnits } from '$mp/utils/price'
import { toSeconds } from '$mp/utils/time'
import { validateBalanceForPurchase } from '$mp/utils/web3'
import NoBalanceError from '$mp/errors/NoBalanceError'
import { IdentityExistsError } from '$shared/errors/Web3'
import { DuplicateIdentityDialog } from '$userpages/components/ProfilePage/IdentityHandler/IdentityChallengeDialog'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog, { type AccessPeriod } from '$mp/components/Modal/ChooseAccessPeriodDialog'
import ConnectEthereumAddressDialog from '$mp/components/Modal/ConnectEthereumAddressDialog'
import useIsMounted from '$shared/hooks/useIsMounted'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import { type Ref } from '$shared/flowtype/common-types'

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
    const dataPerUsd = useSelector(selectDataPerUsd)
    const dataAllowance = BN(useSelector(selectDataAllowanceOrPendingDataAllowance))
    const daiAllowance = BN(useSelector(selectDaiAllowanceOrPendingDaiAllowance))
    const product = useSelector(selectProduct)
    const isMounted = useIsMounted()
    const contractProduct = useSelector(selectContractProduct)
    const contractProductError = useSelector(selectContractProductError)
    const { load: loadEthIdentities, isLinked, connect: connectIdentity } = useEthereumIdentities()
    const accessPeriodParams: Ref<AccessPeriod> = useRef({
        time: '1',
        timeUnit: 'hour',
        paymentCurrency: DEFAULT_CURRENCY,
        priceInEth: undefined,
        priceInDai: undefined,
        priceInEthUsdEquivalent: undefined,
    })
    const purchasePrice: Ref<BN> = useRef(undefined)
    const [creatingIdentity, setCreatingIdentity] = useState(false)

    // Check if current metamask account is linked to Streamr account
    const accountLinked = useMemo(() => !!account && isLinked(account), [isLinked, account])

    // Start loading the contract product & clear allowance state
    useEffect(() => {
        dispatch(resetDataAllowanceState())
        dispatch(getDataAllowance())
        dispatch(resetDaiAllowanceState())
        dispatch(getDaiAllowance())
        dispatch(clearPurchaseState())
        loadEthIdentities()

        loadContractProduct(productId)
            .then(() => {
                if (isMounted()) {
                    setStep(purchaseFlowSteps.ACCESS_PERIOD)
                }
            })
    }, [dispatch, loadEthIdentities, loadContractProduct, productId, isMounted])

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

    const onVerifyAllowance = useCallback(async () => {
        if (!accessPeriodParams.current || !purchasePrice.current) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const { paymentCurrency, priceInDai } = accessPeriodParams.current

        try {
            await validateBalanceForPurchase(purchasePrice.current, paymentCurrency)

            if (!isMounted()) { return }

            switch (paymentCurrency) {
                case paymentCurrencies.ETH:
                    setStep(purchaseFlowSteps.SUMMARY)
                    break

                // eslint-disable-next-line no-case-declarations
                case paymentCurrencies.DAI:
                    const daiPurchasePrice = (priceInDai || 0).toString()
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
                    if (dataAllowance.isLessThan(purchasePrice.current)) {
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
    }, [isMounted, daiAllowance, dataAllowance])

    const onLinkAccount = useCallback(async () => {
        setCreatingIdentity(true)
        let succeeded = false

        try {
            await connectIdentity(account || 'Account name')
            succeeded = true
        } catch (e) {
            console.warn(e)
            setPurchaseError(e)
        } finally {
            if (isMounted()) {
                setCreatingIdentity(false)

                // continue with setting allowance
                if (succeeded) {
                    onVerifyAllowance()
                }
            }
        }
    }, [account, isMounted, connectIdentity, onVerifyAllowance])

    const onSetAccessPeriod = useCallback(async (accessPeriod: AccessPeriod) => {
        accessPeriodParams.current = accessPeriod

        purchasePrice.current = dataForTimeUnits(
            pricePerSecond,
            dataPerUsd,
            priceCurrency,
            accessPeriod.time,
            accessPeriod.timeUnit,
        )

        if (accountLinked) {
            onVerifyAllowance()
        } else {
            setStep(purchaseFlowSteps.LINK_ACCOUNT)
        }
    }, [accountLinked, pricePerSecond, dataPerUsd, onVerifyAllowance, priceCurrency])

    const onSetDataAllowance = useCallback(async () => {
        if (!accessPeriodParams.current || !purchasePrice.current) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const { paymentCurrency } = accessPeriodParams.current

        try {
            await validateBalanceForPurchase(purchasePrice.current, paymentCurrency)

            if (!isMounted()) { return }

            if (BN(dataAllowance).isGreaterThan(0)) {
                await dispatch(resetDataAllowanceToContract())
            } else {
                await dispatch(setDataAllowanceToContract((purchasePrice.current || 0).toString()))
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [isMounted, dataAllowance, dispatch])

    const onSetDaiAllowance = useCallback(async () => {
        if (!accessPeriodParams.current || !purchasePrice.current) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const { paymentCurrency, priceInDai } = accessPeriodParams.current

        try {
            await validateBalanceForPurchase(purchasePrice.current, paymentCurrency)

            if (!isMounted()) { return }

            if (BN(daiAllowance).isGreaterThan(0)) {
                await dispatch(resetDaiAllowanceToContract())
            } else {
                await dispatch(setDaiAllowanceToContract(priceInDai))
            }
        } catch (e) {
            setPurchaseError(e)
        }
    }, [isMounted, daiAllowance, dispatch])

    const onApprovePurchase = useCallback(async () => {
        if (!accessPeriodParams.current || !purchasePrice.current) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const {
            paymentCurrency,
            time,
            timeUnit,
            priceInEth,
            priceInDai,
        } = accessPeriodParams.current

        if (!time || !timeUnit) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const subscriptionTimeInSeconds = toSeconds(time, timeUnit)

        try {
            await validateBalanceForPurchase(purchasePrice.current, paymentCurrency)

            if (!isMounted()) { return }

            await dispatch(buyProduct(productId || '', subscriptionTimeInSeconds, paymentCurrency, priceInEth, priceInDai))
        } catch (e) {
            setPurchaseError(e)
        }
    }, [isMounted, dispatch, productId])

    if (isPending || checkingWeb3 || web3Error) {
        return (
            <Web3ErrorDialog
                waiting={isPending || checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    const {
        paymentCurrency,
        time,
        timeUnit,
        priceInEth,
        priceInDai,
        priceInEthUsdEquivalent,
    } = accessPeriodParams.current || {}

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

        if (purchaseError instanceof IdentityExistsError) {
            return (
                <DuplicateIdentityDialog
                    onClose={onClose}
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

    if (step === purchaseFlowSteps.LINK_ACCOUNT) {
        return (
            <ConnectEthereumAddressDialog
                onCancel={onClose}
                onSet={onLinkAccount}
                waiting={creatingIdentity}
            />
        )
    }

    if (step === purchaseFlowSteps.RESET_DATA_ALLOWANCE) {
        return (
            <ReplaceAllowanceDialog
                onCancel={onClose}
                onSet={onSetDataAllowance}
                settingAllowance={resettingDataAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.DATA_ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetDataAllowance}
                settingAllowance={settingDataAllowance}
                paymentCurrency={paymentCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.RESET_DAI_ALLOWANCE) {
        return (
            <ReplaceAllowanceDialog
                onCancel={onClose}
                onSet={onSetDaiAllowance}
                settingAllowance={resettingDaiAllowance}
            />
        )
    }

    if (step === purchaseFlowSteps.DAI_ALLOWANCE) {
        return (
            <SetAllowanceDialog
                onCancel={onClose}
                onSet={onSetDaiAllowance}
                settingAllowance={settingDaiAllowance}
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
                price={purchasePrice.current}
                ethPrice={priceInEth}
                daiPrice={priceInDai}
                dataPerUsd={dataPerUsd}
                ethPriceInUsd={priceInEthUsdEquivalent || ''}
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
