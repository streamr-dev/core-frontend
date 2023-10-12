import React from 'react'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query'
export { isAddress as isEthereumAddress } from 'web3-validator'
import StreamrClient, { Stream } from 'streamr-client'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import getNativeTokenName from '~/shared/utils/nativeToken'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { getProjectRegistryContract } from '~/getters'
import { Layer } from '~/utils/Layer'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ObjectWithMessage } from '~/shared/consts'
import requirePositiveBalance from '~/shared/utils/requirePositiveBalance'
import { QueriedGraphProject } from '~/shared/types'

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

export function isMessagedObject(e: unknown): e is z.infer<typeof ObjectWithMessage> {
    return ObjectWithMessage.safeParse(e).success
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

export async function sleep(millis: number) {
    await new Promise((resolve) => void setTimeout(resolve, millis))
}

export function refetchQuery(query: UseInfiniteQueryResult | UseQueryResult) {
    setTimeout(async () => {
        try {
            await query.refetch()
        } catch (e) {
            console.warn('Failed to refetch a query', e)
        }
    })
}

function titleize(value: string): string {
    return value.toLowerCase().replace(/\w/, (firstLetter) => firstLetter.toUpperCase())
}

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
