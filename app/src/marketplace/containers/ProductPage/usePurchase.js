// @flow

import { useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import type { SmartContractProduct } from '$mp/flowtype/product-types'
import type { PaymentCurrency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import { dataForTimeUnits } from '$mp/utils/price'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import { validateBalanceForPurchase } from '$mp/utils/web3'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import {
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

export type AccessPeriod = {
    time: NumberString,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    priceInEth: ?NumberString,
    priceInDai: ?NumberString,
    priceInEthUsdEquivalent: ?NumberString,
}

type Allowances = {
    dataAllowance: NumberString,
    daiAllowance: NumberString,
}

export default function usePurchase() {
    const dispatch = useDispatch()
    const dataPerUsd = useSelector(selectDataPerUsd)
    const dataPerUsdRef = useRef(dataPerUsd)
    dataPerUsdRef.current = dataPerUsd

    const purchase = useCallback(async (contractProduct: SmartContractProduct, accessPeriod: AccessPeriod, allowances: Allowances) => {
        if (!contractProduct) {
            throw new Error('no product')
        }

        const { pricePerSecond, priceCurrency } = contractProduct
        const purchasePrice = dataForTimeUnits(
            pricePerSecond,
            dataPerUsdRef.current,
            priceCurrency,
            accessPeriod.time,
            accessPeriod.timeUnit,
        )

        if (!accessPeriod || !purchasePrice) {
            throw new Error(I18n.t('error.noProductOrAccess'))
        }

        const {
            paymentCurrency,
            time,
            timeUnit,
            priceInEth,
            priceInDai,
        } = accessPeriod

        await validateBalanceForPurchase(purchasePrice.current, paymentCurrency)

        const queue = new ActionQueue()

        if (paymentCurrency === paymentCurrencies.DAI) {
            const daiPurchasePrice = (priceInDai || 0).toString()
            const daiAllowance = BN(allowances.daiAllowance)

            if (daiAllowance.isLessThan(daiPurchasePrice)) {
                // we need to reset the allowance before setting it again
                if (daiAllowance.isGreaterThan(0)) {
                    queue.add({
                        id: actionsTypes.RESET_DAI_ALLOWANCE,
                        handler: (update, done) => {
                            try {
                                return setMyDaiAllowance('0')
                                    .onTransactionHash((hash) => {
                                        update(transactionStates.PENDING)
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
                }

                queue.add({
                    id: actionsTypes.SET_DAI_ALLOWANCE,
                    handler: (update, done) => {
                        try {
                            return setMyDaiAllowance(priceInDai)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
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
            }
        } else if (paymentCurrency !== paymentCurrencies.ETH) {
            const dataAllowance = BN(allowances.dataAllowance)

            if (dataAllowance.isLessThan(purchasePrice)) {
                if (dataAllowance.isGreaterThan(0)) {
                    queue.add({
                        id: actionsTypes.RESET_DATA_ALLOWANCE,
                        handler: (update, done) => {
                            try {
                                return setMyDataAllowance('0')
                                    .onTransactionHash((hash) => {
                                        update(transactionStates.PENDING)
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

                queue.add({
                    id: actionsTypes.SET_DATA_ALLOWANCE,
                    handler: (update, done) => {
                        try {
                            return setMyDataAllowance(purchasePrice)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
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
        }

        // Do the actual purchase
        const subscriptionInSeconds = toSeconds(time, timeUnit)

        queue.add({
            id: actionsTypes.PURCHASE,
            handler: (update, done) => {
                try {
                    return buyProduct(contractProduct.id, subscriptionInSeconds, paymentCurrency, priceInEth, priceInDai)
                        .onTransactionHash((hash) => {
                            update(transactionStates.PENDING)
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

        return queue
    }, [dispatch])

    return useMemo(() => ({
        purchase,
    }), [
        purchase,
    ])
}
