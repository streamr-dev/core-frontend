import React, { useEffect, useState } from 'react'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { useOperatorByIdQuery } from '~/hooks/operators'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { toAtto } from '~/marketplace/utils/math'
import { getNativeTokenBalance } from '~/marketplace/utils/web3'
import { toBN } from '~/utils/bn'

export function OperatorChecklist({ operatorId }: { operatorId: string | undefined }) {
    const { funded, nodesDeclared, nodesFunded, nodesReachable, nodesRunning } =
        useOperatorChecklist(operatorId)

    return (
        <>
            <div>
                Operator funded:{' '}
                {typeof funded === 'undefined' ? 'Loading' : funded ? 'Yes' : 'No'}
            </div>
            <div>
                Node addresses declared:{' '}
                {typeof nodesDeclared === 'undefined'
                    ? 'Loading'
                    : nodesDeclared
                    ? 'Yes'
                    : 'No'}
            </div>
            <div>
                Nodes funded:{' '}
                {typeof nodesFunded === 'undefined'
                    ? 'Loading'
                    : nodesFunded
                    ? 'Yes'
                    : 'No'}
            </div>
            <div>
                Nodes reachable:{' '}
                {typeof nodesReachable === 'undefined'
                    ? 'Loading'
                    : nodesReachable
                    ? 'Yes'
                    : 'No'}
            </div>
            <div>
                Nodes running:{' '}
                {typeof nodesRunning === 'undefined'
                    ? 'Loading'
                    : nodesRunning
                    ? 'Yes'
                    : 'No'}
            </div>
        </>
    )
}

interface OperatorChecklist {
    funded?: boolean | undefined
    nodesDeclared?: boolean | undefined
    nodesFunded?: boolean | undefined
    nodesReachable?: boolean | undefined
    nodesRunning?: boolean | undefined
}

function useOperatorChecklist(operatorId: string | undefined): OperatorChecklist {
    const operatorQuery = useOperatorByIdQuery(operatorId)

    const { data: operator, isLoading, isFetching } = operatorQuery

    const [nodesFunded, setNodesFunded] = useState<boolean>()

    const [nodesReachable] = useState<boolean>()

    const { isLoading: isLoadingLiveNodes, count } = useOperatorLiveNodes(
        operatorId || '',
    )

    const nodesRunning = isLoadingLiveNodes ? undefined : count > 0

    useEffect(() => {
        setNodesFunded(undefined)

        if (!operator) {
            return
        }

        if (!operator.nodes.length) {
            /**
             * No nodes = no funded nodes, eh? Let's report that
             * and cut it short!
             */
            return void setNodesFunded(false)
        }

        let mounted = true

        setTimeout(async () => {
            class InsufficientFundsError {}

            try {
                for (const nodeAddress of operator.nodes) {
                    const balance = toBN(
                        await getNativeTokenBalance(nodeAddress, defaultChainConfig.id),
                    )

                    if (!mounted) {
                        return
                    }

                    if (balance.isLessThan(toAtto(0.1))) {
                        throw new InsufficientFundsError()
                    }
                }

                /**
                 * We've checked if each node's MATIC balance is sufficient
                 * and now we can report back.
                 */
                setNodesFunded(true)
            } catch (e) {
                if (e instanceof InsufficientFundsError) {
                    return
                }

                console.warn('Failed to check if nodes are funded', e)
            }
        })

        setTimeout(async () => {})

        return () => {
            mounted = false
        }
    }, [operator])

    if (isLoading || isFetching) {
        /**
         * We're loading the operator. Make all checklist items undefined (all TBD).
         */
        return {}
    }

    if (!operator) {
        /**
         * We're done loading, and found no Operator. There are no checklist
         * items to dash out.
         */
        return {
            funded: false,
            nodesDeclared: false,
            nodesFunded: false,
            nodesReachable: false,
            nodesRunning: false,
        }
    }

    const funded = operator.valueWithoutEarnings.isGreaterThan(0)

    const nodesDeclared = operator.nodes.length > 0

    return {
        funded,
        nodesDeclared,
        nodesFunded,
        nodesReachable,
        nodesRunning,
    }
}
