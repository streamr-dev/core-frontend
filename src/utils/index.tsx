import React from 'react'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { QueryClient } from '@tanstack/react-query'
import StreamrClient, { Stream } from 'streamr-client'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import getNativeTokenName from '~/shared/utils/nativeToken'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { getProjectRegistryContract } from '~/getters'
import { Layer } from '~/utils/Layer'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import requirePositiveBalance from '~/shared/utils/requirePositiveBalance'
import { history } from '~/consts'
import isCodedError from '~/utils/isCodedError'
import { BNish, toBN } from '~/utils/bn'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { operatorModal } from '~/modals/OperatorModal'
import {
    invalidateActiveOperatorByIdQueries,
    invalidateAllOperatorsQueries,
    invalidateDelegationsForWalletQueries,
} from '~/hooks/operators'
import { blockObserver } from '~/utils/blocks'
import { ProjectType } from '~/shared/types'

/**
 * Gas money checker.
 * @param chainId Chain id.
 * @param account Account address.
 * @param options.recover If `true`, the function will pop up a "try
 * again" toast on failure. Default: `false`.
 * @throws `InsufficientFundsError` if the balance turns out to be 0.
 */
export async function ensureGasMonies(
    chainId: number,
    account: string,
    { recover = false }: { recover?: boolean } = {},
) {
    while (true) {
        try {
            await requirePositiveBalance(account)

            break
        } catch (e) {
            if (recover && e instanceof InsufficientFundsError) {
                const tokenName = getNativeTokenName(chainId)

                try {
                    await toaster(Toast, Layer.Toast).pop({
                        title: 'Not enough tokens',
                        type: ToastType.Warning,
                        desc: (
                            <p>
                                You need {tokenName} for gas. Get some
                                <br />
                                and try again.
                            </p>
                        ),
                        okLabel: 'Try again',
                        cancelLabel: 'Cancel',
                    })

                    continue
                } catch (_) {
                    throw e
                }
            }

            throw e
        }
    }
}

/**
 * Scouts for the `Subscribed` event associated with the Project Registry contract
 * and explodes if it can't find one after given number of tries.
 * @param chainId The chain id related to the purchase.
 * @param projectId Project id.
 * @param account Account who made the purchase.
 * @param options.attempts Number of tries (with 3s delay between each).
 * @returns Nothing important. Watch for 'splosions tho.
 */
export async function waitForPurchasePropagation(
    chainId: number,
    projectId: string,
    account: string,
    { attempts = 30 }: { attempts?: number } = {},
) {
    const provider = getPublicWeb3Provider(chainId)

    const contract = getProjectRegistryContract({ chainId, provider })

    // Take a couple of blocks back to be sure.
    const fromBlock = (await provider.getBlockNumber()) - 10

    for (let i = 0; i < attempts; i++) {
        const events = await contract.queryFilter(
            contract.filters.Subscribed(projectId, account),
            fromBlock,
            'latest',
        )

        if (events.length) {
            return
        }

        await sleep(3000)
    }

    throw new Error('Finding `Subscribed` event timed out')
}

const ObjectWithMessage = z.object({
    message: z.string(),
})

export function isMessagedObject(e: unknown): e is z.infer<typeof ObjectWithMessage> {
    return ObjectWithMessage.safeParse(e).success
}

export function isTransactionRejection(e: unknown) {
    return (
        (isCodedError(e) && e.code === 4001) ||
        (isMessagedObject(e) && /user rejected transaction/i.test(e.message))
    )
}

export function isProjectOwnedBy<
    T extends { userAddress: unknown; canGrant?: boolean | null | undefined }[],
>(permissions: T, address: string) {
    const { canGrant = false } =
        permissions.find(
            ({ userAddress }) =>
                typeof userAddress === 'string' &&
                userAddress.toLowerCase() === address.toLowerCase(),
        ) || {}

    return !!canGrant
}

/**
 * Returns a promise that resolves after a given number
 * of milliseconds. Uses `setTimeout` internally.
 */
export async function sleep(millis: number) {
    await new Promise((resolve) => void setTimeout(resolve, millis))
}

/**
 * Turns `abc`, `ABC`, `aBc` into `Abc`.
 */
function titleize(value: string): string {
    return value.toLowerCase().replace(/\w/, (firstLetter) => firstLetter.toUpperCase())
}

/**
 * Converts a string into a good-looking display-ready chain name.
 */
export function formatChainName(chainName: string): string {
    switch (chainName.toLowerCase()) {
        case 'xdai':
            return formatChainName('gnosis')
        case 'bsc':
            return 'Binance Smart Chain'
        default:
            return titleize(chainName)
    }
}

/**
 * Fetches a list of Stream associated with the given list of stream ids. Items
 * that cause fetching failures map to Stream-like `{ id: string }` objects.
 */
export async function fetchStreamlikesByIds(streamIds: string[], client: StreamrClient) {
    const streams: (Stream | { id: string })[] = []

    for (const streamId of streamIds) {
        let stream: Stream | undefined

        try {
            stream = await client.getStream(streamId)
        } catch (e) {
            console.warn(`Failed to get a stream "${streamId}"`, e)
        }

        streams.push(stream || { id: streamId })
    }

    return streams
}

/**
 * Takes the user back in history, but only if they've already navigated
 * somewhere within the app.
 * @param options.onBeforeNavigate Optional callback triggered right before
 * the actual step back. It does not get triggered if we can't take
 * the step.
 */
export function goBack(options: { onBeforeNavigate?: () => void } = {}) {
    const backable = z
        .object({ idx: z.number().min(1) })
        .safeParse(window.history.state).success

    if (!backable) {
        return
    }

    options.onBeforeNavigate?.()

    history.back()
}

let queryClient: QueryClient | undefined

/**
 * Returns the global QueryClient.
 */
export function getQueryClient() {
    if (!queryClient) {
        queryClient = new QueryClient()
    }

    return queryClient
}

const SiSymbol = ['', 'k', 'M', 'G', 'T', 'P']

/**
 * Abbreviates BigNumberish value.
 */
export function abbr(
    value: BNish,
    { fractionalLength = 2, stripFractionalZeros = true } = {},
) {
    const v = toBN(value)

    if (!v.isFinite()) {
        console.warn('Invalid value', v.toString())

        throw new Error('Invalid value')
    }

    const fracLength = Math.max(0, fractionalLength)

    const sign = v.isLessThan(0) ? '-' : ''

    let [integral, fractional = ''] = v.abs().toString().split('.')

    fractional = `${fractional}${[...Array(fracLength)].map(() => '0').join('')}`

    let size = 0

    /**
     * Rebalance the dot and determine what suffix to use by moving digits from
     * integral part to fractional part.
     */
    while (integral.length > 3 && size < SiSymbol.length - 1) {
        fractional = `${integral.substring(integral.length - 3)}${fractional}`

        integral = integral.substring(0, integral.length - 3)

        size++
    }

    let frac = fractional.substring(0, fracLength)

    if (stripFractionalZeros) {
        frac = frac.replace(/0+$/, '')
    }

    return `${sign}${integral}${frac && `.${frac}`}${SiSymbol[size]}`
}

/**
 * Compares 2 BigNumberish values.
 */
export function sameBN(a: BNish, b: BNish) {
    return toBN(a).isEqualTo(toBN(b))
}

/**
 * A function that takes the user through the process of creating
 * an operator or updating an existing operator.
 */
export function saveOperator(
    operator: ParsedOperator | undefined,
    options: {
        onDone?: (operatorId: string) => void
        onError?: (error: unknown) => void
    } = {},
) {
    void (async () => {
        try {
            const operatorId = await operatorModal.pop({
                operator,
            })

            invalidateActiveOperatorByIdQueries(operatorId)

            invalidateAllOperatorsQueries()

            invalidateDelegationsForWalletQueries()

            options.onDone?.(operatorId)
        } catch (e) {
            if (options.onError) {
                options.onError(e)
            } else {
                console.warn('Failed to save an operator', e)
            }
        }
    })()
}

/**
 * Returns a promise that resolves when the Graph indexes all blocks
 * to a given block height.
 */
export function waitForIndexedBlock(blockNumber: number) {
    return new Promise<void>((resolve) => {
        blockObserver.onSpecific(blockNumber, resolve)
    })
}

/**
 *
 */
export function isProjectType(arg: unknown): arg is ProjectType {
    return (
        arg === ProjectType.DataUnion ||
        arg === ProjectType.OpenData ||
        arg === ProjectType.PaidData
    )
}
