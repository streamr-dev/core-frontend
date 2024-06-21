import { config as configs } from '@streamr/config'
import { produce } from 'immer'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    ChainConfigExtension,
    fallbackChainConfigExtension,
    parsedChainConfigExtension,
} from '~/utils/chainConfigExtension'
import { Chain } from '~/types'
import formatConfigUrl from './formatConfigUrl'

function getPreferredChainName(chainName: string) {
    if (/amoy/i.test(chainName)) {
        return 'amoy'
    }

    return chainName.toLowerCase()
}

function getChainConfigWithFallback(chainName: string): Chain {
    try {
        return getChainConfig(chainName)
    } catch (_) {}

    return getChainConfig('polygon')
}

export function getCurrentChain() {
    return getChainConfigWithFallback(
        new URLSearchParams(window.location.search).get('chain') || 'polygon',
    )
}

export function getCurrentChainId() {
    return getCurrentChain().id
}

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || 'polygon'

    return useMemo(() => getChainConfigWithFallback(chainName), [chainName])
}

export function useCurrentChainId() {
    return useCurrentChain().id
}

export function useCurrentChainSymbolicName() {
    const chainId = useCurrentChainId()

    return useMemo(() => getSymbolicChainName(chainId), [chainId])
}

let chainEntriesByIdOrName:
    | undefined
    | Partial<
          Record<
              string | number,
              {
                  symbolicName: string
                  config: Chain
                  configExtension: ChainConfigExtension
              }
          >
      > = undefined

function getChainEntry(chainIdOrName: string | number) {
    if (!chainEntriesByIdOrName) {
        chainEntriesByIdOrName = {}

        for (const [rawSymbolicName, config] of Object.entries<Chain>(configs)) {
            const symbolicName = getPreferredChainName(rawSymbolicName)

            const configExtension =
                parsedChainConfigExtension[rawSymbolicName] ||
                fallbackChainConfigExtension

            const { dockerHost } = configExtension

            const sanitizedConfig = produce(config, (draft) => {
                for (const rpc of draft.rpcEndpoints) {
                    rpc.url = formatConfigUrl(rpc.url, {
                        dockerHost,
                    })
                }

                if (draft.entryPoints) {
                    for (const entrypoint of draft.entryPoints) {
                        entrypoint.websocket.host = formatConfigUrl(
                            entrypoint.websocket.host,
                            {
                                dockerHost,
                            },
                        )
                    }
                }

                if (draft.theGraphUrl) {
                    draft.theGraphUrl = formatConfigUrl(draft.theGraphUrl, { dockerHost })
                }
            })

            chainEntriesByIdOrName[config.id] = {
                symbolicName,
                config: sanitizedConfig,
                configExtension,
            }

            chainEntriesByIdOrName[symbolicName] = {
                symbolicName,
                config: sanitizedConfig,
                configExtension,
            }
        }

        console.log(chainEntriesByIdOrName)
    }

    const entry =
        chainEntriesByIdOrName[
            typeof chainIdOrName === 'string'
                ? getPreferredChainName(chainIdOrName)
                : chainIdOrName
        ]

    if (!entry) {
        throw new Error(
            `Could not find config for "${chainIdOrName}" (${
                typeof chainIdOrName === 'string' ? 'chain name' : 'chain id'
            })`,
        )
    }

    return entry
}

export function getChainConfig(chainIdOrSymbolicName: string | number): Chain {
    return getChainEntry(chainIdOrSymbolicName).config
}

export function getSymbolicChainName(chainId: number) {
    return getChainEntry(chainId).symbolicName
}

export function getChainConfigExtension(chainId: number) {
    return getChainEntry(chainId).configExtension
}
