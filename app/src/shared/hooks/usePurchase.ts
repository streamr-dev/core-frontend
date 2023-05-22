import { useCallback } from 'react'
import BN from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { priceForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase, getCustomTokenDecimals } from '$mp/utils/web3'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import { buyProject, getTokenAllowance, setTokenAllowance } from '$app/src/services/marketplace'
import { addTransaction } from '$mp/modules/transactions/actions'
import { toSeconds } from '$mp/utils/time'
import { fromDecimals } from '$mp/utils/math'
import {TimeUnit} from "$shared/utils/timeUnit"
import { SmartContractProject } from '$app/src/services/projects'
import { NumberString } from '../types/common-types'

export const actionsTypes = {
    SET_ALLOWANCE: 'setAllowance',
    SUBSCRIPTION: 'subscription',
}

const INFINITE_ALLOWANCE = new BN(2).pow(256).minus(1)

type Purchase = {
    contractProject: SmartContractProject
    length: NumberString,
    timeUnit: TimeUnit,
    chainId: number,
}

export default function usePurchase() {
    const dispatch = useDispatch()
    return useCallback(
        async ({ contractProject, length, timeUnit, chainId }: Purchase) => {
            if (!contractProject) {
                throw new Error('no project')
            }

            if (!length || !timeUnit) {
                throw new Error('no length and/or time unit provided')
            }

            const paymentDetails = contractProject.paymentDetails[0] // contractProject has only chains we asked to load
            if (!paymentDetails) {
                throw new Error('could not get payment details for selected chain')
            }

            const pricePerSecond = new BN(paymentDetails.pricePerSecond)
            const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
            if (!purchasePrice) {
                throw new Error('could not calculate price')
            }

            const allowance = await getTokenAllowance(paymentDetails.pricingTokenAddress, chainId) || new BN(0)
            const needsAllowance = allowance.isLessThan(purchasePrice)
            const pricingTokenDecimals = await getCustomTokenDecimals(paymentDetails.pricingTokenAddress, chainId)
            await validateBalanceForPurchase({
                price: fromDecimals(purchasePrice, pricingTokenDecimals),
                pricingTokenAddress: paymentDetails.pricingTokenAddress,
                includeGasForSetAllowance: needsAllowance,
            })
            const queue = new ActionQueue()

            // Set allowance
            if (needsAllowance) {
                queue.add({
                    id: actionsTypes.SET_ALLOWANCE,
                    handler: (update, done) => {
                        try {
                            return setTokenAllowance(INFINITE_ALLOWANCE, paymentDetails.pricingTokenAddress, chainId)
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
            const subscriptionInSeconds = toSeconds(length, timeUnit)
            queue.add({
                id: actionsTypes.SUBSCRIPTION,
                handler: (update, done) => {
                    try {
                        return buyProject(
                            contractProject.id,
                            subscriptionInSeconds,
                            contractProject.chainId,
                        )
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING, hash)
                                dispatch(addTransaction(hash, transactionTypes.SUBSCRIPTION))
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

            return {
                queue,
            }
        },
        [dispatch],
    )
}
