import { produce } from 'immer'
import { Toaster, toaster } from 'toasterhea'
import { useEffect } from 'react'
import { create } from 'zustand'
import ChainSelectorModal, {
    ChainSelectorResult,
    getPurchasePreconditions,
} from '~/modals/ChainSelectorModal'
import { Layer } from '~/utils/Layer'
import AccessPeriodModal, { AccessPeriod } from '~/modals/AccessPeriodModal'
import { isAbandonment } from '~/modals/ProjectModal'
import AllowanceModal from '~/modals/AllowanceModal'
import PurchaseCompleteModal from '~/modals/PurchaseCompleteModal'
import { getMarketplaceAddress } from '~/marketplace/utils/web3'
import { priceForTimeUnits } from '~/marketplace/utils/price'
import networkPreflight from '~/utils/networkPreflight'
import { timeUnits } from '~/shared/utils/timeUnit'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import isCodedError from '~/utils/isCodedError'
import ConfirmPurchaseModal from '~/modals/ConfirmPurchaseModal'
import { toSeconds } from '~/marketplace/utils/time'
import AccessingProjectModal from '~/modals/AccessingProjectModal'
import { getAllowance, getERC20TokenContract, getMarketplaceContract } from '~/getters'
import { RejectionReason } from '~/modals/BaseModal'
import FailedPurchaseModal from '~/modals/FailedPurchaseModal'
import { ensureGasMonies, waitForPurchasePropagation } from '~/utils'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import { getProjectForPurchase, getProjectSubscriptions } from '~/getters/hub'
import { TheGraph } from '../types'
import { getSigner } from './wallet'

interface Store {
    inProgress: Record<string, true | undefined>
    purchase: (projectId: string) => Promise<void>
    fetchingSubscriptions: Record<string, true | undefined>
    subscriptions: Record<
        string,
        | {
              cache: number | undefined
              entries: TheGraph.ProjectSubscription[]
          }
        | undefined
    >
    fetchSubscriptions: (projectId: string) => Promise<void>
    invalidateSubscription: (projectId: string) => void
}

const usePurchaseStore = create<Store>((set, get) => {
    function isInProgress(projectId: string) {
        return !!get().inProgress[projectId]
    }

    return {
        inProgress: {},

        subscriptions: {},

        fetchingSubscriptions: {},

        async fetchSubscriptions(projectId) {
            if (!!get().fetchingSubscriptions[projectId]) {
                return
            }

            set((current) =>
                produce(current, (next) => {
                    next.fetchingSubscriptions[projectId] = true
                }),
            )

            try {
                const entries = await getProjectSubscriptions(projectId)

                set((current) =>
                    produce(current, (next) => {
                        const { cache } = next.subscriptions[projectId] || {}

                        next.subscriptions[projectId] = {
                            cache,
                            entries,
                        }
                    }),
                )
            } finally {
                set((current) =>
                    produce(current, (next) => {
                        delete next.fetchingSubscriptions[projectId]
                    }),
                )
            }
        },

        invalidateSubscription(projectId) {
            set((current) =>
                produce(current, (next) => {
                    const { cache = 0, entries = [] } =
                        next.subscriptions[projectId] || {}

                    next.subscriptions[projectId] = {
                        cache: cache + 1,
                        entries,
                    }
                }),
            )
        },

        async purchase(projectId) {
            if (isInProgress(projectId)) {
                return
            }

            try {
                set((current) =>
                    produce(current, (next) => {
                        next.inProgress[projectId] = true
                    }),
                )

                const { paymentDetails = [], streams = [] } =
                    (await getProjectForPurchase(projectId)) || {}

                const chainIds = paymentDetails
                    .map(({ domainId }) => Number(domainId))
                    .filter(Number.isSafeInteger)

                let chainId: number | undefined = chainIds[0]

                const skipChainSelector = !!chainId && chainIds.length === 1

                let chainSelectorResult: ChainSelectorResult | undefined

                while (true) {
                    /**
                     * The following ifelse dance makes sure we
                     * - don't open the Chain Selector for single-chain projects,
                     * - recycle existing `chainSelectorResult` in a single-chain
                     *   project scenario.
                     *
                     * For multi-chain projects we display the modal and let users
                     * choose their preference.
                     *
                     * The Chain Selector modal uses `getPurchasePreconditions` internally.
                     */
                    if (skipChainSelector) {
                        if (!chainSelectorResult) {
                            chainSelectorResult = await getPurchasePreconditions({
                                chainId,
                                paymentDetails,
                            })
                        }
                    } else {
                        chainSelectorResult = undefined

                        chainSelectorResult = await toaster(
                            ChainSelectorModal,
                            Layer.Modal,
                        ).pop({
                            chainIds,
                            paymentDetails,
                            projectId,
                            selectedChainId: chainId,
                        })
                    }

                    if (!chainSelectorResult) {
                        throw new Error('World flipped upside down')
                    }

                    /**
                     * Store the selected chain id so that we can show it next time
                     * we show the Chain Selector modal (if we loop back to it within
                     * this purchase).
                     */
                    chainId = chainSelectorResult.chainId

                    const selectedChainId = chainId

                    const {
                        account,
                        balance,
                        pricePerSecond,
                        tokenAddress,
                        tokenDecimals,
                        tokenSymbol,
                        usdRate,
                    } = chainSelectorResult

                    let accessPeriod: AccessPeriod | undefined

                    const initialAccessRange: AccessPeriod = {
                        quantity: 1,
                        unit: timeUnits.hour,
                        exceedsAllowance: false,
                    }

                    let allowanceModal: Toaster<typeof AllowanceModal> | undefined

                    let startOver = false

                    while (true) {
                        let bail = false

                        try {
                            try {
                                accessPeriod = await toaster(
                                    AccessPeriodModal,
                                    Layer.Modal,
                                ).pop({
                                    account,
                                    backable: !skipChainSelector,
                                    balance,
                                    chainId: selectedChainId,
                                    pricePerSecond,
                                    quantity: initialAccessRange.quantity,
                                    tokenAddress,
                                    tokenDecimals,
                                    tokenSymbol,
                                    unit: initialAccessRange.unit,
                                    usdRate,
                                })
                            } catch (e: unknown) {
                                if (isAbandonment(e) && !skipChainSelector) {
                                    /**
                                     * The user abandoned the Access Period modal. We break the current
                                     * phase and tell the workflow to take us back to the Chain Selector.
                                     */
                                    startOver = true

                                    break
                                }

                                /**
                                 * Something 'sploded in the Access Period and we end up here. Tell
                                 * the workflow to terminate the purchase with the exception that
                                 * brought us here.
                                 */
                                bail = true

                                throw e
                            }

                            if (!accessPeriod) {
                                throw new Error('World flipped upside down')
                            }

                            const { quantity, unit, exceedsAllowance } = accessPeriod

                            /**
                             * Store the latest access range so that next time we loop back
                             * to the Access Period modal we can prepopulate it with the recent
                             * set of properties.
                             */
                            Object.assign(initialAccessRange, accessPeriod)

                            if (exceedsAllowance) {
                                /**
                                 * Only show the Allowance modal if there's need for it. Access
                                 * Period modal calculates it for us.
                                 */
                                allowanceModal = toaster(AllowanceModal, Layer.Modal)

                                setTimeout(async () => {
                                    try {
                                        /**
                                         * Open the Allowance modal asynchronously so that
                                         * it does not block. We do it in a `setTimeout` so
                                         * that we can react to exceptions in a clean and
                                         * predictable way.
                                         */
                                        await allowanceModal?.pop({
                                            tokenSymbol,
                                        })
                                    } catch (e) {
                                        if (!isAbandonment(e)) {
                                            /**
                                             * Let's just log. The AllowanceModal doesn't have
                                             * all that many moving parts.
                                             */
                                            console.warn(e)
                                        }
                                    }
                                })

                                const total = priceForTimeUnits(
                                    pricePerSecond,
                                    quantity,
                                    unit,
                                ).toString()

                                async function setAllowance() {
                                    while (true) {
                                        try {
                                            /**
                                             * Make sure the user can affort gas. Empty wallets
                                             * take a walk.
                                             */
                                            await ensureGasMonies(
                                                selectedChainId,
                                                account,
                                                {
                                                    recover: true,
                                                },
                                            )

                                            await networkPreflight(selectedChainId)

                                            const signer = await getSigner()

                                            /**
                                             * Send the `approve` method on the selected
                                             * ERC-20 token contract.
                                             *
                                             * This step is required so that the contract
                                             * itself can spend user's funds.
                                             */

                                            const tx = await getERC20TokenContract({
                                                tokenAddress,
                                                provider: signer,
                                            }).approve(
                                                getMarketplaceAddress(selectedChainId),
                                                total,
                                            )

                                            await tx.wait()

                                            /**
                                             * Wallets do not force users to set the requested
                                             * allowance amounts. Users can set more – that's ok,
                                             * but also less (too little).
                                             *
                                             * In the next steps we verify if the allowance
                                             * is set properly.
                                             */
                                            const allowance = await getAllowance(
                                                selectedChainId,
                                                tokenAddress,
                                                account,
                                                {
                                                    recover: true,
                                                },
                                            )

                                            if (allowance.lt(total)) {
                                                /**
                                                 * If `total` exceeds `allowance` we loop back to top
                                                 * and make the wallet pop up the allowance box again.
                                                 */
                                                continue
                                            }

                                            /**
                                             * If the allowance is set properly we can move on. Let's
                                             * break the loop and let the function return.
                                             */
                                            break
                                        } catch (e: unknown) {
                                            console.warn('Setting allowance failed', e)

                                            if (e instanceof InsufficientFundsError) {
                                                /**
                                                 * The user had a chance to react to the gas money
                                                 * check and dismissed the Insufficient Funds
                                                 * toast. Pass the exception on!
                                                 *
                                                 * This will take us back to the Access Period
                                                 * modal (bail = false).
                                                 */
                                                throw e
                                            }

                                            if (isCodedError(e) && e.code === 4001) {
                                                /**
                                                 * The user rejected the transaction signature, thus
                                                 * does not wanna continue. Go back to the Access
                                                 * Period modal.
                                                 */
                                                throw e
                                            }

                                            /**
                                             * Something unexpected happened. Ask the user if they want
                                             * to try setting the allowance again.
                                             */
                                            try {
                                                await toaster(Toast, Layer.Toast).pop({
                                                    title: 'Setting allowance failed',
                                                    type: ToastType.Warning,
                                                    desc: 'Would you like to try again?',
                                                    okLabel: 'Yes',
                                                    cancelLabel: 'No',
                                                })

                                                /**
                                                 * She said yaaas! Take the user back to the top and make
                                                 * the wallet pop up the allowance setting box again.
                                                 */
                                                continue
                                            } catch (_) {
                                                /**
                                                 * The user does not want to retry thus we pass the exception
                                                 * on and finish terminate the allowance track.
                                                 *
                                                 * This takes us back to the Access Period modal.
                                                 */
                                                throw e
                                            }
                                        }
                                    }
                                }

                                await setAllowance()
                            }

                            const seconds = toSeconds(quantity, unit)

                            async function buy() {
                                while (true) {
                                    let confirmPurchaseModal:
                                        | Toaster<typeof ConfirmPurchaseModal>
                                        | undefined = toaster(
                                        ConfirmPurchaseModal,
                                        Layer.Modal,
                                    )

                                    try {
                                        setTimeout(async () => {
                                            try {
                                                /**
                                                 * Open the Confirm Purchase modal in the background (i.e. via
                                                 * `setTimeout`). This allows the main thread to continue with
                                                 * the important stuff.
                                                 */
                                                await confirmPurchaseModal?.pop()
                                            } catch (e) {
                                                if (!isAbandonment(e)) {
                                                    console.warn(e)
                                                }
                                            }
                                        })

                                        /**
                                         * Make sure the user can affort gas. Empty wallets
                                         * take a walk.
                                         */
                                        await ensureGasMonies(selectedChainId, account, {
                                            recover: true,
                                        })

                                        await networkPreflight(selectedChainId)

                                        const signer = await getSigner()

                                        let accessingProjectModal:
                                            | Toaster<typeof AccessingProjectModal>
                                            | undefined = toaster(
                                            AccessingProjectModal,
                                            Layer.Modal,
                                        )

                                        try {
                                            /**
                                             * The following is the actual buying call emitted into the
                                             * network. Note that the gas limit is dynamic and depends
                                             * on the number of streams associated with the project.
                                             */
                                            const tx = await getMarketplaceContract({
                                                chainId: selectedChainId,
                                                provider: signer,
                                            }).buy(projectId, seconds, {
                                                gasLimit: 2e5 + streams.length * 1e5,
                                            })

                                            /**
                                             * Once we receive the transaction hash we can safely close the Confirm
                                             * Purchase modal and carry on.
                                             */
                                            confirmPurchaseModal?.discard()

                                            setTimeout(async () => {
                                                /**
                                                 * We pop up the Accessing Project modal and let it live for as long
                                                 * as it takes. We close it later (see `finally`). It does not block.
                                                 */
                                                try {
                                                    await accessingProjectModal?.pop()
                                                } catch (e) {
                                                    if (!isAbandonment(e)) {
                                                        console.warn(e)
                                                    }
                                                }
                                            })

                                            await tx.wait()

                                            /**
                                             * `Buy` transaction is done and now we wait for the `Subscribe` event
                                             * to propagate through.
                                             *
                                             * We may want to either separate it from `buy` function, or wrap it with
                                             * another `try…catch`, and pop up a "retry" toast on a timeout.
                                             */
                                            await waitForPurchasePropagation(
                                                selectedChainId,
                                                projectId,
                                                account,
                                            )
                                        } finally {
                                            accessingProjectModal?.discard()

                                            accessingProjectModal = undefined
                                        }

                                        break
                                    } catch (e) {
                                        if (
                                            e === RejectionReason.CancelButton ||
                                            e === RejectionReason.EscapeKey
                                        ) {
                                            throw new Error(
                                                'User decided to stay on the invalid network',
                                            )
                                        }

                                        if (e instanceof InsufficientFundsError) {
                                            /**
                                             * The user had a chance to react to the gas money
                                             * check and dismissed the Insufficient Funds
                                             * toast. Pass the exception on!
                                             *
                                             * This will take us back to the Access Period
                                             * modal (bail = false).
                                             */
                                            throw e
                                        }

                                        if (isCodedError(e) && e.code === 4001) {
                                            /**
                                             * The user rejected the transaction signature, thus
                                             * does not wanna continue. Go back to the Access
                                             * Period modal.
                                             */
                                            throw e
                                        }

                                        confirmPurchaseModal?.discard()

                                        try {
                                            await toaster(
                                                FailedPurchaseModal,
                                                Layer.Modal,
                                            ).pop()

                                            /**
                                             * The user clicked "Try again" in the Failed Purchase
                                             * modal. Loop back to the top and try to buy the
                                             * product again.
                                             */
                                            continue
                                        } catch (_) {
                                            /**
                                             * The user click "Go back" in the Failed Purchase
                                             * modal which loops the workflow back to the Access
                                             * Period modal.
                                             */
                                            throw e
                                        }
                                    } finally {
                                        confirmPurchaseModal?.discard()

                                        confirmPurchaseModal = undefined
                                    }
                                }
                            }

                            await buy()
                        } catch (e) {
                            if (bail) {
                                /**
                                 * Exceptions that happen along the raised `bail` flag terminate
                                 * the purchase.
                                 */
                                throw e
                            }

                            console.warn(
                                'Unsuccessful purchase attempt. Trying again.',
                                e,
                            )

                            /**
                             * Exceptions that happen with lowered `bail` flag take users back
                             * to the Access Period modal.
                             */
                            continue
                        } finally {
                            allowanceModal?.discard()

                            allowanceModal = undefined
                        }

                        /**
                         * The user bought! Now we have to show the Purchase Complete modal,
                         * which blocks the flow. Last stop!
                         */
                        break
                    }

                    if (startOver) {
                        continue
                    }

                    try {
                        await toaster(PurchaseCompleteModal, Layer.Modal).pop()
                    } catch (e) {
                        if (!isAbandonment(e)) {
                            throw e
                        }
                    }

                    /**
                     * Settle and finalize.
                     */
                    break
                }
            } finally {
                set((current) =>
                    produce(current, (next) => {
                        delete next.inProgress[projectId]
                    }),
                )
            }

            /**
             * After the following invalidation all mounted `useHasActiveProjectSubscription`
             * hooks are gonna update. This will cause both the Connect and the Live data
             * pages change from the "Get access" placeholder view to their
             * actual views. All in place!
             */
            get().invalidateSubscription(projectId)
        },
    }
})

export function usePurchaseCallback() {
    return usePurchaseStore().purchase
}

export function useIsProjectBeingPurchased(projectId: string) {
    const { inProgress } = usePurchaseStore()

    return (
        Object.prototype.hasOwnProperty.call(inProgress, projectId) &&
        !!inProgress[projectId]
    )
}

export function useHasActiveProjectSubscription(
    projectId: string | undefined,
    account: string | undefined,
) {
    const { subscriptions, fetchSubscriptions } = usePurchaseStore()

    const { cache } = (projectId && subscriptions[projectId]) || {}

    useEffect(() => {
        if (projectId) {
            fetchSubscriptions(projectId)
        }
    }, [cache, fetchSubscriptions, projectId])

    if (!projectId || !account) {
        return false
    }

    const { entries } = subscriptions[projectId] || {}

    if (!entries) {
        return
    }

    const { endTimestamp = '0' } =
        entries.find((s) => s.userAddress.toLowerCase() === account.toLowerCase()) || {}

    return Number.parseInt(endTimestamp, 10) * 1000 >= Date.now()
}

export function useIsAnyPurchaseInProgress() {
    return !!Object.keys(usePurchaseStore().inProgress).length
}
