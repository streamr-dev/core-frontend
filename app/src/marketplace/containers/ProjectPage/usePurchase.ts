import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'
import type { SmartContractProduct, AccessPeriod } from '$mp/types/project-types'
import { priceForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase, getDataAddress, getCustomTokenDecimals } from '$mp/utils/web3'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import { buyProject, getTokenAllowance, setTokenAllowance } from '$app/src/services/marketplace'
import { getProductSubscription } from '$mp/modules/product/actions'
import { addTransaction } from '$mp/modules/transactions/actions'
import { toSeconds } from '$mp/utils/time'
import { fromDecimals } from '$mp/utils/math'
export const actionsTypes = {
    SET_DAI_ALLOWANCE: 'setDaiAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    SET_DATA_ALLOWANCE: 'setDataAllowance',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    SUBSCRIPTION: 'subscription',
}
type Purchase = {
    contractProduct: SmartContractProduct
    accessPeriod: AccessPeriod
    gasIncrease?: number
}
export default function usePurchase() {
    const dispatch = useDispatch()
    return useCallback(
        async ({ contractProduct, accessPeriod, gasIncrease }: Partial<Purchase> = {}) => {
            if (!contractProduct) {
                throw new Error('no product')
            }

            if (!contractProduct.pricingTokenAddress) {
                throw new Error('no pricingTokenAddress')
            }

            const { paymentCurrency, time, timeUnit } = accessPeriod || {}
            const { chainId, pricePerSecond } = contractProduct

            if (!accessPeriod || !time || !timeUnit || !paymentCurrency) {
                throw new Error('no access period')
            }

            if (contractProduct.pricingTokenAddress !== getDataAddress(chainId) && paymentCurrency !== paymentCurrencies.PRODUCT_DEFINED) {
                throw new Error(`cannot pay for this product with ${paymentCurrency}`)
            }

            const purchasePrice = priceForTimeUnits(pricePerSecond, time, timeUnit)
            if (!purchasePrice) {
                throw new Error('could not calculate price')
            }

            const allowance = await getTokenAllowance(contractProduct.pricingTokenAddress, chainId) || new BN(0)
            const needsAllowance = allowance.isLessThan(purchasePrice)
            const needsAllowanceReset = needsAllowance && allowance.isGreaterThan(0)
            const pricingTokenDecimals = await getCustomTokenDecimals(contractProduct.pricingTokenAddress, chainId)
            await validateBalanceForPurchase({
                price: fromDecimals(purchasePrice, pricingTokenDecimals),
                paymentCurrency,
                pricingTokenAddress: contractProduct.pricingTokenAddress,
                includeGasForSetAllowance: needsAllowance,
                includeGasForResetAllowance: needsAllowanceReset,
            })
            const queue = new ActionQueue()

            // Reset allowance if needed
            if (needsAllowanceReset) {
                queue.add({
                    id: actionsTypes.RESET_DATA_ALLOWANCE,
                    handler: (update, done) => {
                        try {
                            return setTokenAllowance('0', contractProduct.pricingTokenAddress, chainId)
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

            // Set allowance
            if (needsAllowance) {
                queue.add({
                    id: actionsTypes.SET_DATA_ALLOWANCE,
                    handler: (update, done) => {
                        try {
                            return setTokenAllowance(purchasePrice, contractProduct.pricingTokenAddress, chainId)
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
            const subscriptionInSeconds = toSeconds(time, timeUnit)
            queue.add({
                id: actionsTypes.SUBSCRIPTION,
                handler: (update, done) => {
                    try {
                        return buyProject(
                            contractProduct.id,
                            subscriptionInSeconds,
                            contractProduct.chainId,
                        )
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
        },
        [dispatch],
    )
}
