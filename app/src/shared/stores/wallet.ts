import detectProvider from '@metamask/detect-provider'
import produce from 'immer'
import { z } from 'zod'
import { create } from 'zustand'
import { lookupEnsName } from '$shared/modules/user/services'
import { isEthereumAddress } from '$app/src/marketplace/utils/validate'

interface RequestArguments {
    readonly method: string
    readonly params?: readonly unknown[] | object
}

interface MetaMaskProvider {
    isMetaMask?: boolean
    providers?: MetaMaskProvider[]
    isConnected?: () => boolean
    request: <T = unknown>(args: RequestArguments) => Promise<T>
    on: (eventName: string | symbol, listener: (...args: unknown[]) => void) => this
    removeListener: (
        eventName: string | symbol,
        listener: (...args: unknown[]) => void,
    ) => this
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

const promiseMap = new Map<MetaMaskProvider, Promise<unknown>>()

/**
 * Pops up MetaMask and asks the user to unlock it. It recycles promises,
 * so that consecutive account list requests don't fail but fall back to
 * the leading promise.
 *
 * @returns a promise for the leading `eth_requestAccounts` call.
 */
export async function connect() {
    const provider = await getWalletProvider()

    if (!promiseMap.get(provider)) {
        const promise = provider.request({ method: 'eth_requestAccounts' })

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
    }

    return promiseMap.get(provider)
}

/**
 * @returns account address (a string), or `undefined` if there are no available accounts.
 */
export async function getWalletAccount() {
    const provider = await getWalletProvider()

    const [account = undefined] = await provider.request<string[]>({
        method: 'eth_accounts',
    })

    return account
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

        const addr = isEthereumAddress(account || '') ? account : undefined

        if (lastKnownAccount === addr) {
            return
        }

        lastKnownAccount = addr

        if (addr && typeof get().ens[addr] === 'undefined' && !ensLookups[addr]) {
            ensLookups[addr] = true

            setTimeout(async () => {
                try {
                    const ensName = await lookupEnsName(addr)

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
