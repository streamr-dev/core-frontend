import detectProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { BrowserProvider } from 'ethers'
import { produce } from 'immer'
import { isAddress } from 'web3-validator'
import { z } from 'zod'
import { create } from 'zustand'
import { getENSDomainsForWallet } from '~/getters'
import { connectModal } from '~/modals/ConnectModal'
import { Break } from '~/utils/errors'
import { isMessagedObject, isRejectionReason } from '~/utils/exceptions'

interface MetaMaskProvider extends MetaMaskInpageProvider {
    providers?: MetaMaskProvider[]
}

function isStringArray(value: unknown): value is string[] {
    return z.array(z.string()).safeParse(value).success
}

let providerPromise: Promise<MetaMaskProvider> | undefined

/**
 * Detects current MetaMask provider, and explodes if it's not available.
 * @returns a promise that resolves with a MetaMask provider instance.
 */
export function getWalletProvider() {
    if (providerPromise) {
        return providerPromise
    }

    providerPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            let provider: MetaMaskProvider | null = await detectProvider()

            if (!provider) {
                return void reject(new Error('No provider'))
            }

            if (provider.providers?.length) {
                // Multiple wallets available? Detect MetaMask.
                provider =
                    provider.providers.find((p) => p.isMetaMask) ?? provider.providers[0]
            }

            resolve(provider)
        })
    })

    return providerPromise
}

export async function getWalletWeb3Provider() {
    const provider = await getWalletProvider()

    return new BrowserProvider(provider as any)
}

export async function getSigner() {
    let retry = true

    while (true) {
        try {
            const provider = await getWalletWeb3Provider()

            const signer = await provider.getSigner()

            await signer.getAddress()

            return signer
        } catch (e) {
            if (!retry) {
                throw e
            }

            if (!isMessagedObject(e) || !/unknown account #\d+/i.test(e.message)) {
                throw e
            }

            try {
                await connectModal.pop()

                /**
                 * If after this it still fails to get a proper signer (with
                 * an address and all) ignore further attempts and just
                 * throw the error (see above).
                 */
                retry = false
            } catch (f) {
                if (isRejectionReason(f)) {
                    /**
                     * The user kept their wallet locked and there's nothing
                     * we can do. Let's break.
                     */
                    throw Break
                }

                throw f
            }
        }
    }
}

const promiseMap = new Map<MetaMaskProvider, Promise<string | undefined>>()

/**
 * @param options.connect a flag that instructs the function to either
 * - get the account discreetly using `eth_accounts` (if `false`) - default, or
 * - trigger the unlocking with `eth_requestAccounts`.
 *
 * @returns an account address (a string), or `undefined` if there are
 * no available accounts.
 */
export async function getWalletAccount({
    connect = false,
}: { connect?: boolean } = {}): Promise<string | undefined> {
    const provider = await getWalletProvider()

    if (!connect) {
        const accounts = await provider.request<string[]>({
            method: 'eth_accounts',
        })

        return accounts?.[0]
    }

    const existingPromise: Promise<string | undefined> | undefined =
        promiseMap.get(provider)

    if (existingPromise) {
        return existingPromise
    }

    const promise = new Promise<string | undefined>((resolve, reject) => {
        setTimeout(async () => {
            try {
                const accounts = await provider.request<string[]>({
                    method: 'eth_requestAccounts',
                })

                resolve(accounts?.[0])
            } catch (e) {
                reject(e)
            }
        })
    })

    promiseMap.set(provider, promise)

    setTimeout(async () => {
        try {
            await promise
        } catch (e) {
            // Do nothing.
        } finally {
            promiseMap.delete(provider)
        }
    })

    return promise
}

interface WalletStore {
    account: string | undefined
    ens: Record<string, string | undefined>
}

const useWalletStore = create<WalletStore>((set, get) => {
    let lastKnownAccount: string | undefined

    const ensLookups: Record<string, true | undefined> = {}

    function onAccountsChange(accounts: unknown) {
        const [account = undefined] = isStringArray(accounts) ? accounts : []

        const addr = isAddress(account || '') ? account : undefined

        if (lastKnownAccount === addr) {
            return
        }

        lastKnownAccount = addr

        if (addr && typeof get().ens[addr] === 'undefined' && !ensLookups[addr]) {
            ensLookups[addr] = true

            setTimeout(async () => {
                try {
                    const [ensName = undefined] = await getENSDomainsForWallet(addr)

                    set((current) =>
                        produce(current, (next) => {
                            next.ens[addr.toLowerCase()] = ensName
                        }),
                    )
                } catch (e) {
                    console.warn('Failed to fetch ENS domain name', e)
                } finally {
                    delete ensLookups[addr]
                }
            })
        }

        set((current) =>
            produce(current, (next) => {
                next.account = addr
            }),
        )
    }

    setTimeout(async () => {
        try {
            const provider = await getWalletProvider()

            provider.on('accountsChanged', onAccountsChange)

            const accounts = await provider.request<string[]>({
                method: 'eth_accounts',
            })

            onAccountsChange(accounts)
        } catch (e) {
            console.warn('Provider setup failed', e)
        }
    })

    return {
        account: undefined,

        ens: {},
    }
})

/**
 * A hook that gives you the current MetaMask account address, if available.
 * @returns account address (a string), or `undefined` if the wallet is either
 * locked or has no accounts.
 */
export function useWalletAccount() {
    return useWalletStore().account
}

/**
 * A hook that gives you an ENS domain for an account address.
 * @returns either an ENS domain name, or an empty string.
 */
export function useEns(account: string | undefined) {
    const { ens } = useWalletStore()

    return (account && ens[account]) || ''
}
