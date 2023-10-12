import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { Heartbeat } from '~/hooks/useInterceptHeartbeats'
import { sleep } from '~/utils'

const TTL = 60 * 1000

interface Probe {
    updatedAt: number
    reachable: boolean
    pending: boolean
}

const useOperatorReachabilityStore = create<{
    probes: Record<string, Probe | undefined>
    nodes: Record<string, string | undefined>
    probe: (
        nodeAddress: string,
        heartbeat: Heartbeat,
        options?: { timeoutMillis?: number },
    ) => Promise<void>
}>((set, get) => {
    function updateProbe(url: string, fn: (probe: Probe) => Probe | void) {
        set((store) =>
            produce(store, ({ probes }) => {
                const updatedAt = Date.now()

                probes[url] = produce(
                    Object.assign(probes[url] || { reachable: false, pending: false }, {
                        updatedAt,
                    }),
                    fn,
                )
            }),
        )
    }

    return {
        nodes: {},

        probes: {},

        async probe(nodeAddress, heartbeat, { timeoutMillis = 10000 } = {}) {
            const { host, port, tls = false } = heartbeat.websocket || {}

            const url = host && port ? `${tls ? 'wss:' : 'ws:'}//${host}:${port}` : ''

            set((store) =>
                produce(store, (draft) => {
                    /**
                     * Heartbeats for a single node can carry different WebSocket URLs
                     * over time, cause c'est la vie.
                     */
                    draft.nodes[nodeAddress] = url
                }),
            )

            const { updatedAt = 0, pending = false } = get().probes[url] || {}

            if (pending || updatedAt + TTL >= Date.now()) {
                /**
                 * Ignore cache hits and pending probes. Note that we probe based
                 * on WebSocket URLs not on node addresses. We support the unlikely
                 * but technically possible scenario where nodes share a URL.
                 */
                return
            }

            updateProbe(url, (draft) => {
                draft.pending = true
            })

            let reachable = false

            let ws: WebSocket | undefined

            try {
                reachable = await Promise.race([
                    sleep(timeoutMillis).then(() => {
                        throw new Error('Timeout')
                    }),
                    new Promise<boolean>((resolve, reject) => {
                        if (!url) {
                            return void resolve(false)
                        }

                        ws = new WebSocket(url)

                        ws.addEventListener('open', () => {
                            resolve(true)
                        })

                        ws.addEventListener('error', (e) => {
                            reject(e)
                        })
                    }),
                ])
            } finally {
                ws?.close()

                ws = undefined

                updateProbe(url, (draft) => {
                    Object.assign(draft, {
                        pending: false,
                        reachable,
                    })
                })
            }
        },
    }
})

type Reachability = 'probing' | 'none' | 'all' | 'some'

export function useOperatorReachability(
    heartbeats: Record<string, Heartbeat | undefined>,
): Reachability {
    const { probe, nodes, probes } = useOperatorReachabilityStore()

    useEffect(() => {
        Object.entries(heartbeats).forEach(([nodeAddress, heartbeat]) => {
            if (!heartbeat) {
                return
            }

            void (async () => {
                try {
                    await probe(nodeAddress, heartbeat)
                } catch (e) {
                    console.warn(
                        `Failed to probe WebSocket URL for node "${nodeAddress}"`,
                        heartbeat,
                        e,
                    )
                }
            })()
        })
    }, [heartbeats, probe])

    const nodeAddresses = Object.keys(heartbeats)

    let numOfReachableNodes = 0

    for (const addr of nodeAddresses) {
        const { reachable = false, pending = false } = probes[nodes[addr] || ''] || {}

        if (pending) {
            /**
             * At least one node is being probbed and that's all we can tell
             * about the collective.
             */
            return 'probing'
        }

        if (reachable) {
            numOfReachableNodes += 1
        }
    }

    if (!numOfReachableNodes) {
        return 'none'
    }

    return nodeAddresses.length === numOfReachableNodes ? 'all' : 'some'
}
