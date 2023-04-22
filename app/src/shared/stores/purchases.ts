import { create } from 'zustand'
import produce from 'immer'
import { Toaster, toaster } from 'toasterhea'
import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import ChainSelectorModal, {
    ChainSelectorResult,
} from '$app/src/modals/ChainSelectorModal'
import { Layer } from '$utils/Layer'
import { fetchGraphProjectForPurchase } from '$app/src/utils/fetchers'
import AccessPeriodModal, { AccessPeriod } from '$app/src/modals/AccessPeriodModal'
import { isAbandonment } from '$app/src/modals/ProjectModal'
import AllowanceModal from '$app/src/modals/AllowanceModal'
import PurchaseCompleteModal from '$app/src/modals/PurchaseCompleteModal'
import { erc20TokenContractMethods } from '$mp/utils/web3'
import { priceForTimeUnits } from '$mp/utils/price'
import networkPreflight from '$app/src/utils/networkPreflight'
import { timeUnits } from '$shared/utils/timeUnit'
import Toast, { ToastType } from '$shared/toasts/Toast'
import { marketplaceContract } from '$app/src/services/marketplace'
import { gasLimits } from '$shared/utils/constants'
import isCodedError from '$utils/isCodedError'
import ConfirmPurchaseModal from '$app/src/modals/ConfirmPurchaseModal'
import { toSeconds } from '$mp/utils/time'
import AccessingProjectModal from '$app/src/modals/AccessingProjectModal'
import { getAllowance } from '$app/src/getters'
import { RejectReason } from '$app/src/modals/Modal'
import FailedPurchaseModal from '$app/src/modals/FailedPurchaseModal'
import { useAuthController } from '$app/src/auth/hooks/useAuthController'
import { ensureGasMonies } from '$app/src/utils'
import InsufficientFundsError from '../errors/InsufficientFundsError'

interface Store {
    inProgress: Record<string, true | undefined>
    purchase: (projectId: string, account: string) => Promise<void>
}

const usePurchaseStore = create<Store>((set, get) => {
    function isInProgress(projectId: string) {
        return !!get().inProgress[projectId]
    }

    return {
        inProgress: {},

        async purchase(projectId, account) {
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
                    (await fetchGraphProjectForPurchase(projectId)) || {}

                const chainIds = paymentDetails
                    .map(({ domainId }) => Number(domainId))
                    .filter(Number.isSafeInteger)

                let chainId: number | undefined = chainIds[0]

                while (true) {
                    let chainSelectorResult: ChainSelectorResult | undefined

                    try {
                        chainSelectorResult = await toaster(
                            ChainSelectorModal,
                            Layer.Modal,
                        ).pop({
                            account,
                            chainIds,
                            paymentDetails,
                            projectId,
                            selectedChainId: chainId,
                        })
                    } catch (e: unknown) {
                        if (isAbandonment(e)) {
                            break
                        }

                        throw e
                    }

                    if (!chainSelectorResult) {
                        throw new Error('World flipped upside down')
                    }

                    chainId = chainSelectorResult.chainId

                    const selectedChainId = chainId

                    const {
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
                                    backable: true,
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
                                if (isAbandonment(e)) {
                                    startOver = true

                                    break
                                }

                                bail = true

                                throw e
                            }

                            if (!accessPeriod) {
                                throw new Error('World flipped upside down')
                            }

                            const { quantity, unit, exceedsAllowance } = accessPeriod

                            Object.assign(initialAccessRange, accessPeriod)

                            if (exceedsAllowance) {
                                allowanceModal = toaster(AllowanceModal, Layer.Modal)

                                setTimeout(async () => {
                                    try {
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
                                )

                                async function setAllowance() {
                                    while (true) {
                                        try {
                                            await ensureGasMonies(
                                                selectedChainId,
                                                account,
                                                {
                                                    recover: true,
                                                },
                                            )

                                            await networkPreflight(selectedChainId)

                                            await erc20TokenContractMethods(
                                                tokenAddress,
                                                false,
                                                selectedChainId,
                                            )
                                                .approve(
                                                    marketplaceContract(
                                                        false,
                                                        selectedChainId,
                                                    ).options.address,
                                                    total,
                                                )
                                                .send({
                                                    gas: gasLimits.APPROVE,
                                                    from: account,
                                                    maxPriorityFeePerGas: null,
                                                    maxFeePerGas: null,
                                                })

                                            const allowance = await getAllowance(
                                                selectedChainId,
                                                tokenAddress,
                                                account,
                                                {
                                                    recover: true,
                                                },
                                            )

                                            if (allowance.isLessThan(total)) {
                                                continue
                                            }

                                            break
                                        } catch (e: unknown) {
                                            console.warn('Setting allowance failed', e)

                                            if (e instanceof InsufficientFundsError) {
                                                /**
                                                 * The user had a chance to react to the gas balance
                                                 * check and dismissed the toast. Pass on.
                                                 */
                                                throw e
                                            }

                                            if (isCodedError(e) && e.code === 4001) {
                                                throw e
                                            }

                                            try {
                                                await toaster(Toast, Layer.Toast).pop({
                                                    title: 'Setting allowance failed',
                                                    type: ToastType.Warning,
                                                    desc: 'Would you like to try again?',
                                                    okLabel: 'Yes',
                                                    cancelLabel: 'No',
                                                })

                                                continue
                                            } catch (_) {
                                                throw e
                                            }
                                        }
                                    }
                                }

                                await setAllowance()
                            }

                            const seconds = toSeconds(new BigNumber(quantity), unit)

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
                                                await confirmPurchaseModal?.pop()
                                            } catch (e) {
                                                if (!isAbandonment(e)) {
                                                    console.warn(e)
                                                }
                                            }
                                        })

                                        await ensureGasMonies(selectedChainId, account, {
                                            recover: true,
                                        })

                                        await networkPreflight(selectedChainId)

                                        let accessingProjectModal:
                                            | Toaster<typeof AccessingProjectModal>
                                            | undefined = toaster(
                                            AccessingProjectModal,
                                            Layer.Modal,
                                        )

                                        try {
                                            await marketplaceContract(
                                                false,
                                                selectedChainId,
                                            )
                                                .methods.buy(
                                                    projectId,
                                                    // Round down to nearest full second, otherwise allowance could run out
                                                    seconds.dp(0, BigNumber.ROUND_DOWN),
                                                )
                                                .send({
                                                    gas: 2e5 + streams.length * 1e5,
                                                    from: account,
                                                    maxPriorityFeePerGas: null,
                                                    maxFeePerGas: null,
                                                })
                                                .once('transactionHash', async () => {
                                                    confirmPurchaseModal?.discard()

                                                    try {
                                                        await accessingProjectModal?.pop()
                                                    } catch (e) {
                                                        if (!isAbandonment(e)) {
                                                            console.warn(e)
                                                        }
                                                    }
                                                })
                                        } finally {
                                            accessingProjectModal?.discard()

                                            accessingProjectModal = undefined
                                        }

                                        break
                                    } catch (e) {
                                        if (
                                            e === RejectReason.Cancel ||
                                            e === RejectReason.EscapeKey
                                        ) {
                                            throw e
                                        }

                                        if (e instanceof InsufficientFundsError) {
                                            /**
                                             * The user had a chance to react to the gas balance
                                             * check and dismissed the toast. Pass on.
                                             */
                                            throw e
                                        }

                                        if (isCodedError(e) && e.code === 4001) {
                                            throw e
                                        }

                                        confirmPurchaseModal?.discard()

                                        try {
                                            await toaster(
                                                FailedPurchaseModal,
                                                Layer.Modal,
                                            ).pop()

                                            continue
                                        } catch (_) {
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
                                throw e
                            }

                            continue
                        } finally {
                            allowanceModal?.discard()

                            allowanceModal = undefined
                        }

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

                    break
                }
            } finally {
                set((current) =>
                    produce(current, (next) => {
                        delete next.inProgress[projectId]
                    }),
                )
            }
        },
    }
})

export function usePurchaseCallback() {
    const { purchase } = usePurchaseStore()

    const { address: account } = useAuthController().currentAuthSession

    return useCallback(
        (projectId: string) => purchase(projectId, account),
        [purchase, account],
    )
}

export function useIsProjectBeingPurchased(projectId: string) {
    const { inProgress } = usePurchaseStore()

    return (
        Object.prototype.hasOwnProperty.call(inProgress, projectId) &&
        !!inProgress[projectId]
    )
}