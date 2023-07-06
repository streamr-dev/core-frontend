import React from 'react'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import getNativeTokenName from '~/shared/utils/nativeToken'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { getProjectRegistryContract } from '~/getters'
import { Layer } from '~/utils/Layer'
import getPublicWeb3 from '~/utils/web3/getPublicWeb3'
import { ObjectWithMessage } from '~/shared/consts'
import requirePositiveBalance from '~/shared/utils/requirePositiveBalance'

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
    const signer = getPublicWeb3(chainId)

    const contract = getProjectRegistryContract({ chainId, signer })

    // Take a couple of blocks back to be sure.
    const fromBlock = (await signer.getBlockNumber()) - 10

    for (let i = 0; i < attempts; i++) {
        const events = await contract.queryFilter(
            contract.filters.Subscribed(projectId, account),
            fromBlock,
            'latest',
        )

        if (events.length) {
            return
        }

        await new Promise((resolve) => void setTimeout(resolve, 3000))
    }

    throw new Error('Finding `Subscribed` event timed out')
}

export function isMessagedObject(e: unknown): e is z.infer<typeof ObjectWithMessage> {
    return ObjectWithMessage.safeParse(e).success
}
