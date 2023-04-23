import React from 'react'
import { toaster } from 'toasterhea'
import BigNumber from 'bignumber.js'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import getNativeTokenName from '$shared/utils/nativeToken'
import Toast, { ToastType } from '$shared/toasts/Toast'
import { fromAtto } from '$mp/utils/math'
import { getProjectRegistryContract } from '$app/src/getters'
import { Layer } from '$utils/Layer'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'

export async function ensureGasMonies(
    chainId: number,
    account: string,
    { recover = false }: { recover?: boolean } = {},
) {
    while (true) {
        try {
            const balance = fromAtto(
                new BigNumber(await getPublicWeb3(chainId).eth.getBalance(account)),
            )

            if (balance.isGreaterThan(0)) {
                break
            }

            throw new InsufficientFundsError(account)
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
    const web3 = getPublicWeb3(chainId)

    const contract = getProjectRegistryContract(chainId, web3)

    const params = {
        fromBlock: (await web3.eth.getBlockNumber()) - 10, // take a couple of blocks back to be sure
        toBlock: 'latest',
        filter: {
            projectId,
            subscriber: account,
        },
    }

    for (let i = 0; i < attempts; i++) {
        const events = await contract.getPastEvents('Subscribed', params)

        if (events.length) {
            return
        }

        await new Promise((resolve) => void setTimeout(resolve, 3000))
    }

    throw new Error('Finding `Subscribed` event timed out')
}
