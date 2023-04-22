import React from 'react'
import { toaster } from 'toasterhea'
import BigNumber from 'bignumber.js'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import getNativeTokenName from '$shared/utils/nativeToken'
import Toast, { ToastType } from '$shared/toasts/Toast'
import { fromAtto } from '$mp/utils/math'
import { Layer } from './Layer'
import getPublicWeb3 from './web3/getPublicWeb3'

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
