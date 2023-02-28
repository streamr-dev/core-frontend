import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { ProjectId, AccessPeriod } from '$mp/types/project-types'
import useModal from '$shared/hooks/useModal'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import { useController } from '$mp/containers/ProductController'
import { usePending } from '$shared/hooks/usePending'
import { purchaseFlowSteps } from '$mp/utils/constants'
import { selectContractProduct, selectContractProductError } from '$mp/modules/contractProduct/selectors'
import { transactionStates, paymentCurrencies, gasLimits } from '$shared/utils/constants'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import NoBalanceError from '$mp/errors/NoBalanceError'
import { getDataAddress, getTokenInformation, getCustomTokenBalance, getMyNativeTokenBalance, getMyDataTokenBalance } from '$mp/utils/web3'
import PurchaseTransactionProgress from '$mp/components/Modal/PurchaseTransactionProgress'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import PurchaseComplete from '$mp/components/Modal/PurchaseComplete'
import PurchaseError from '$mp/components/Modal/PurchaseError'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog from '$mp/components/Modal/ChooseAccessPeriodDialog'
import WrongNetworkSelectedDialog from '$shared/components/WrongNetworkSelectedDialog'
import useIsMounted from '$shared/hooks/useIsMounted'
import type { Ref, UseStateTuple } from '$shared/types/common-types'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import { isDataUnionProduct } from '$mp/utils/product'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import useNativeTokenName from '$shared/hooks/useNativeTokenName'
import { getChainIdFromApiString } from '$shared/utils/chains'
import usePurchase, { actionsTypes } from '$shared/hooks/usePurchase'

type Props = {
    productId: ProjectId
    api: Record<string, any>
}

export const PurchaseDialog = ({ productId, api }: Props) => {
    const dispatch = useDispatch()
    const { product, loadContractProduct } = useController()
    const { web3Error, checkingWeb3, account } = useWeb3Status({
        requireWeb3: true,
        requireNetwork: getChainIdFromApiString(product.chain),
    })
    const { isPending: isContractProductLoadPending } = usePending('contractProduct.LOAD')
    const { isPending: isPurchasePending, wrap: wrapPurchase } = usePending('product.PURCHASE')
    const nativeTokenName = useNativeTokenName()
    const [step, setStep] = useState(null)
    const [purchaseError, setPurchaseError] = useState(null)
    const isMounted = useIsMounted()
    const contractProduct = useSelector(selectContractProduct)
    const contractProductError = useSelector(selectContractProductError)
    const chainId = product && getChainIdFromApiString(product.chain)
    const accessPeriodParams: Ref<AccessPeriod> = useRef({
        time: '1',
        timeUnit: 'hour',
        paymentCurrency:
            contractProduct && contractProduct.pricingTokenAddress && contractProduct.pricingTokenAddress === getDataAddress(chainId)
                ? paymentCurrencies.DATA
                : paymentCurrencies.PRODUCT_DEFINED,
        price: undefined,
        approxUsd: undefined,
    })
    const [balances, setBalances] = useState({})
    const purchase = usePurchase()
    const [queue, setQueue]: UseStateTuple<any> = useState(undefined)
    const [currentAction, setCurrentAction] = useState(undefined)
    const [status, setStatus] = useState({})
    const [purchaseStarted, setPurchaseStarted] = useState(false)
    const [purchaseTransaction, setPurchaseTransaction] = useState(undefined)
    const [productTokenSymbol, setProductTokenSymbol] = useState('DATA')
    const pricingTokenAddress = contractProduct && contractProduct.pricingTokenAddress
    const dataUnion = useDataUnion()
    const dataUnionRef = useRef()
    const isDataUnion = !!(product && isDataUnionProduct(product))
    dataUnionRef.current = isDataUnion ? dataUnion : undefined
    // Start loading the contract product & clear allowance state
    useEffect(() => {
        loadContractProduct(productId, chainId).then(() => {
            if (isMounted()) {
                setStep(purchaseFlowSteps.ACCESS_PERIOD)
            }
        })
    }, [dispatch, loadContractProduct, productId, chainId, isMounted])
    useEffect(() => {
        const loadBalances = async () => {
            if (!account) {
                return
            }

            const tokenBalance = await getCustomTokenBalance(pricingTokenAddress, account, true, chainId)
            const nativeTokenBalance = await getMyNativeTokenBalance()
            const dataBalance = await getMyDataTokenBalance()

            if (isMounted()) {
                setBalances({
                    [paymentCurrencies.DATA]: dataBalance,
                    [paymentCurrencies.PRODUCT_DEFINED]: tokenBalance,
                    [paymentCurrencies.NATIVE]: nativeTokenBalance,
                })
            }
        }

        loadBalances()
    }, [account, chainId, pricingTokenAddress, isMounted])
    useEffect(() => {
        const load = async () => {
            if (pricingTokenAddress != null) {
                const info = await getTokenInformation(pricingTokenAddress, chainId)

                if (isMounted() && info) {
                    setProductTokenSymbol(info.symbol)
                }
            }
        }

        load()
    }, [pricingTokenAddress, chainId, isMounted])
    const onSetAccessPeriod = useCallback(async (accessPeriod: AccessPeriod) => {
        accessPeriodParams.current = accessPeriod
        setStep(purchaseFlowSteps.SUMMARY)
    }, [])
    const onApprovePurchase = useCallback(
        async () =>
            wrapPurchase(async () => {
                if (!accessPeriodParams.current) {
                    throw new Error('Product and access data should be defined!')
                }

                try {
                    const { version } = dataUnionRef.current || {}
                    const { queue: nextQueue } = await purchase({
                        contractProduct,
                        accessPeriod: accessPeriodParams.current,
                        // Buying a DU2 product requires more gas
                        gasIncrease: version === 2 ? gasLimits.BUY_PRODUCT_DU2_INCREASE : 0,
                    })

                    if (isMounted()) {
                        setStep(purchaseFlowSteps.PROGRESS)
                        setQueue(nextQueue)
                    }
                } catch (e) {
                    console.warn(e)

                    if (isMounted()) {
                        setPurchaseError(e)
                    }
                }
            }),
        [wrapPurchase, purchase, contractProduct, isMounted],
    )
    useEffect(() => {
        if (!queue) {
            return () => {}
        }

        setStatus(
            queue.getActions().reduce(
                (result, { id }) => ({
                    ...result,
                    [id]: transactionStates.STARTED,
                }),
                {},
            ),
        )
        setPurchaseTransaction(undefined)
        setPurchaseStarted(true)
        queue
            .subscribe('started', (id) => {
                if (isMounted()) {
                    setCurrentAction(id)
                }
            })
            .subscribe('status', (id, nextStatus, hash) => {
                if (isMounted()) {
                    setStatus((prevStatus) => ({ ...prevStatus, [id]: nextStatus }))

                    if (id === actionsTypes.SUBSCRIPTION && nextStatus === transactionStates.PENDING && !!hash) {
                        setPurchaseTransaction(hash)
                    }
                }
            })
            .start()
        return () => {
            queue.unsubscribeAll()
        }
    }, [queue, isMounted])
    const allSucceeded = useMemo(() => Object.values(status).every((value) => value === transactionStates.CONFIRMED), [status])
    const allCompleted = useMemo(
        () => Object.values(status).every((value) => value === transactionStates.CONFIRMED || value === transactionStates.FAILED),
        [status],
    )
    useEffect(() => {
        if (!purchaseStarted || !allCompleted) {
            return
        }

        setTimeout(() => {
            if (isMounted()) {
                setStep(purchaseFlowSteps.COMPLETE)
            }
        }, 500)
    }, [purchaseStarted, allCompleted, isMounted])
    const onClose = useCallback(
        ({
            viewInCore = false,
        }: {
            viewInCore?: boolean
        } = {}) => {
            api.close({
                started: purchaseStarted,
                succeeded: allSucceeded,
                viewInCore,
            })
        },
        [api, purchaseStarted, allSucceeded],
    )
    const { switchChain, switchPending } = useSwitchChain()

    if (!isContractProductLoadPending && !checkingWeb3 && web3Error) {
        if (web3Error instanceof WrongNetworkSelectedError) {
            return (
                <WrongNetworkSelectedDialog
                    onClose={onClose}
                    onSwitch={() => switchChain(web3Error.requiredNetwork)}
                    switching={switchPending}
                    requiredNetwork={web3Error.requiredNetwork}
                    currentNetwork={web3Error.currentNetwork}
                />
            )
        }

        return <Web3ErrorDialog onClose={onClose} error={web3Error} />
    }

    const { paymentCurrency, time, timeUnit, price, approxUsd } = accessPeriodParams.current || {}

    if (!isContractProductLoadPending && !checkingWeb3 && (purchaseError || contractProductError)) {
        if (purchaseError instanceof NoBalanceError) {
            return (
                <NoBalanceDialog
                    onCancel={onClose}
                    required={purchaseError.getRequired()}
                    balances={purchaseError.getBalances()}
                    paymentCurrency={paymentCurrency}
                    nativeTokenName={nativeTokenName}
                    productTokenSymbol={productTokenSymbol}
                />
            )
        }

        return <ErrorDialog title="An error occurred" message={(purchaseError || contractProductError).message} onClose={onClose} />
    }

    if (step === purchaseFlowSteps.ACCESS_PERIOD) {
        return (
            <ChooseAccessPeriodDialog
                pricePerSecond={contractProduct.pricePerSecond}
                pricingTokenAddress={contractProduct.pricingTokenAddress}
                pricingTokenDecimals={contractProduct.pricingTokenDecimals}
                tokenSymbol={productTokenSymbol}
                chainId={chainId}
                balances={balances}
                onCancel={onClose}
                onNext={onSetAccessPeriod}
                disabled={checkingWeb3}
                initialValues={{
                    paymentCurrency,
                    time,
                    timeUnit,
                    price,
                    approxUsd,
                }}
            />
        )
    }

    if (step === purchaseFlowSteps.SUMMARY) {
        return (
            <PurchaseSummaryDialog
                waiting={isPurchasePending}
                name={product.name}
                time={time}
                timeUnit={timeUnit}
                price={price}
                tokenSymbol={productTokenSymbol}
                approxUsd={approxUsd}
                onBack={() => setStep(purchaseFlowSteps.ACCESS_PERIOD)}
                onCancel={onClose}
                onPay={onApprovePurchase}
                paymentCurrency={paymentCurrency}
            />
        )
    }

    if (step === purchaseFlowSteps.PROGRESS) {
        return (
            <PurchaseTransactionProgress
                status={status}
                onCancel={onClose}
                prompt={currentAction && status[currentAction] === transactionStates.STARTED ? currentAction : undefined}
                tokenSymbol={productTokenSymbol}
            />
        )
    }

    if (step === purchaseFlowSteps.COMPLETE) {
        if (allSucceeded) {
            return (
                <PurchaseComplete
                    onClose={onClose}
                    onContinue={() =>
                        onClose({
                            viewInCore: true,
                        })
                    }
                    txHash={purchaseTransaction}
                    chainId={chainId}
                />
            )
        }

        return <PurchaseError status={status} onClose={onClose} />
    }

    return null
}

const PurchaseModal = () => {
    const { isOpen, api, value } = useModal('purchase')

    if (!isOpen) {
        return null
    }

    const { productId } = value || {}
    return <PurchaseDialog productId={productId} api={api} />
}

export default PurchaseModal
