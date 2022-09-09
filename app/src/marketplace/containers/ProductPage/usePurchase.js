// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'

import type { SmartContractProduct, AccessPeriod } from '$mp/flowtype/product-types'
import { priceForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase, getDataAddress } from '$mp/utils/web3'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import {
    buyProduct,
    getMyDaiAllowance,
    setMyDaiAllowance,
    getMyTokenAllowance,
    setMyTokenAllowance,
} from '$mp/modules/product/services'
import { getProductSubscription } from '$mp/modules/product/actions'
import { addTransaction } from '$mp/modules/transactions/actions'
import { toSeconds } from '$mp/utils/time'

export const actionsTypes = {
    SET_DAI_ALLOWANCE: 'setDaiAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    SET_DATA_ALLOWANCE: 'setDataAllowance',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    SUBSCRIPTION: 'subscription',
}

type Purchase = {
    contractProduct: SmartContractProduct,
    accessPeriod: AccessPeriod,
    gasIncrease?: number,
}

export default function usePurchase() {
    const dispatch = useDispatch()

    return useCallback(async ({ contractProduct, accessPeriod, gasIncrease }: Purchase = {}) => {
        if (!contractProduct) {
            throw new Error('no product')
        }

        if (!contractProduct.pricingTokenAddress) {
            throw new Error('no pricingTokenAddress')
        }

        const { paymentCurrency, time, timeUnit, price } = accessPeriod || {}
        const { chainId } = contractProduct

        if (!accessPeriod || !time || !timeUnit || !paymentCurrency) {
            throw new Error('no access period')
        }

        if (contractProduct.pricingTokenAddress !== getDataAddress(chainId) && paymentCurrency !== paymentCurrencies.PRODUCT_DEFINED) {
            throw new Error(`cannot pay for this product with ${paymentCurrency}`)
        }

        const isEthPurchase = !!(paymentCurrency === paymentCurrencies.ETH)
        const isDaiPurchase = !!(paymentCurrency === paymentCurrencies.DAI)
        const isUniswapPurchase = isEthPurchase || isDaiPurchase
        const isTokenPurchase = !isEthPurchase

        let purchasePrice
        if (isUniswapPurchase) {
            if (!price) {
                throw new Error('no price')
            }

            purchasePrice = price
        } else {
            const { pricePerSecond } = contractProduct

            purchasePrice = priceForTimeUnits(
                pricePerSecond,
                time,
                timeUnit,
            )

            if (!purchasePrice) {
                throw new Error('could not calculate price')
            }
        }

        let allowance
        if (isDaiPurchase) {
            allowance = await getMyDaiAllowance(chainId)
        } else if (!isEthPurchase) {
            allowance = await getMyTokenAllowance(contractProduct.pricingTokenAddress, chainId)
        }

        allowance = BN(allowance || 0)

        const needsAllowance = !!(isTokenPurchase && allowance.isLessThan(price))
        const needsAllowanceReset = !!(needsAllowance && allowance.isGreaterThan(0))

        await validateBalanceForPurchase({
            price: purchasePrice,
            paymentCurrency,
            pricingTokenAddress: contractProduct.pricingTokenAddress,
            includeGasForSetAllowance: needsAllowance,
            includeGasForResetAllowance: needsAllowanceReset,
        })

        const queue = new ActionQueue()

        if (needsAllowanceReset && isDaiPurchase) {
            queue.add({
                id: actionsTypes.RESET_DAI_ALLOWANCE,
                handler: (update, done) => {
                    try {
                        return setMyDaiAllowance('0', chainId)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.RESET_DAI_ALLOWANCE))
                                done()
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                console.error(error)
                                done()
                                update(transactionStates.FAILED, error)
                            })
                    } catch (e) {
                        done()
                        update(transactionStates.FAILED, e)
                    }

                    return null
                },
            })
        } else if (needsAllowanceReset && !isEthPurchase) {
            queue.add({
                id: actionsTypes.RESET_DATA_ALLOWANCE,
                handler: (update, done) => {
                    try {
                        return setMyTokenAllowance('0', contractProduct.pricingTokenAddress, chainId)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.RESET_DATA_ALLOWANCE))
                                done()
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                done()
                                update(transactionStates.FAILED, error)
                            })
                    } catch (e) {
                        console.error(e)
                        done()
                        update(transactionStates.FAILED, e)
                    }

                    return null
                },
            })
        }

        if (needsAllowance && isDaiPurchase) {
            queue.add({
                id: actionsTypes.SET_DAI_ALLOWANCE,
                handler: (update, done) => {
                    try {
                        return setMyDaiAllowance(price, chainId)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.SET_DAI_ALLOWANCE))
                                done()
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                console.error(error)
                                done()
                                update(transactionStates.FAILED, error)
                            })
                    } catch (e) {
                        done()
                        update(transactionStates.FAILED, e)
                    }

                    return null
                },
            })
        } else if (needsAllowance && !isEthPurchase) {
            queue.add({
                id: actionsTypes.SET_DATA_ALLOWANCE,
                handler: (update, done) => {
                    try {
                        return setMyTokenAllowance(purchasePrice, contractProduct.pricingTokenAddress, chainId)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.SET_DATA_ALLOWANCE))
                                done()
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                console.error(error)
                                done()
                                update(transactionStates.FAILED, error)
                            })
                    } catch (e) {
                        done()
                        update(transactionStates.FAILED, e)
                    }

                    return null
                },
            })
        }

        // Do the actual purchase
        const subscriptionInSeconds = toSeconds(time, timeUnit).toString()

        queue.add({
            id: actionsTypes.SUBSCRIPTION,
            handler: (update, done) => {
                try {
                    return buyProduct(contractProduct.id, contractProduct.chainId, subscriptionInSeconds, paymentCurrency, purchasePrice, gasIncrease)
                        .onTransactionHash((hash) => {
                            update(transactionStates.PENDING, hash)
                            dispatch(addTransaction(hash, transactionTypes.SUBSCRIPTION))
                            done()
                        })
                        .onTransactionComplete(() => {
                            update(transactionStates.CONFIRMED)
                            dispatch(getProductSubscription(contractProduct.id, contractProduct.chainId))
                        })
                        .onError((error) => {
                            console.error(error)
                            done()
                            update(transactionStates.FAILED, error)
                        })
                } catch (e) {
                    done()
                    update(transactionStates.FAILED, e)
                }

                return null
            },
        })

        return {
            queue,
        }
    }, [dispatch])
}
