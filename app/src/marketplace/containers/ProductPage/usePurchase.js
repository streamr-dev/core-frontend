// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import type { SmartContractProduct, AccessPeriod } from '$mp/flowtype/product-types'
import type { NumberString } from '$shared/flowtype/common-types'
import { dataForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase } from '$mp/utils/web3'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import {
    getMyDaiAllowance,
    getMyDataAllowance,
    setMyDaiAllowance,
    setMyDataAllowance,
} from '$mp/modules/allowance/services'
import { buyProduct } from '$mp/modules/purchase/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { toSeconds } from '$mp/utils/time'

export const actionsTypes = {
    SET_DAI_ALLOWANCE: 'setDaiAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    SET_DATA_ALLOWANCE: 'setDataAllowance',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    PURCHASE: 'purchase',
}

type Purchase = {
    contractProduct: SmartContractProduct,
    accessPeriod: AccessPeriod,
    dataPerUsd: NumberString,
}

export default function usePurchase() {
    const dispatch = useDispatch()

    const purchase = useCallback(async ({ contractProduct, accessPeriod, dataPerUsd }: Purchase = {}) => {
        if (!contractProduct) {
            throw new Error('no product')
        }

        if (!dataPerUsd) {
            throw new Error('no dataPerUsd')
        }

        const { paymentCurrency, time, timeUnit, price } = accessPeriod || {}

        if (!accessPeriod || !time || !timeUnit || !paymentCurrency) {
            throw new Error(I18n.t('no access period'))
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
            const { pricePerSecond, priceCurrency } = contractProduct

            purchasePrice = dataForTimeUnits(
                pricePerSecond,
                dataPerUsd,
                priceCurrency,
                time,
                timeUnit,
            )

            if (!purchasePrice) {
                throw new Error(I18n.t('could not calculate price'))
            }
        }

        let allowance
        if (isDaiPurchase) {
            allowance = await getMyDaiAllowance()
        } else if (!isEthPurchase) {
            allowance = await getMyDataAllowance()
        }

        allowance = BN(allowance || 0)

        const needsAllowance = !!(isTokenPurchase && allowance.isLessThan(price))
        const needsAllowanceReset = !!(needsAllowance && allowance.isGreaterThan(0))

        await validateBalanceForPurchase({
            price: purchasePrice,
            paymentCurrency,
            includeGasForSetAllowance: needsAllowance,
            includeGasForResetAllowance: needsAllowanceReset,
        })

        const queue = new ActionQueue()

        if (needsAllowanceReset && isDaiPurchase) {
            queue.add({
                id: actionsTypes.RESET_DAI_ALLOWANCE,
                handler: (update, done) => {
                    try {
                        return setMyDaiAllowance('0')
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.RESET_DAI_ALLOWANCE))
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
                        return setMyDataAllowance('0')
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
                        return setMyDaiAllowance(price)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.SET_DAI_ALLOWANCE))
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
                        return setMyDataAllowance(purchasePrice)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.SET_DATA_ALLOWANCE))
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
            id: actionsTypes.PURCHASE,
            handler: (update, done) => {
                try {
                    return buyProduct(contractProduct.id, subscriptionInSeconds, paymentCurrency, purchasePrice)
                        .onTransactionHash((hash) => {
                            update(transactionStates.PENDING, hash)
                            dispatch(addTransaction(hash, transactionTypes.PURCHASE))
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

    return useMemo(() => ({
        purchase,
    }), [
        purchase,
    ])
}
