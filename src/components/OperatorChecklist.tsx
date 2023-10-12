import React, { ComponentProps, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { useOperatorByIdQuery } from '~/hooks/operators'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { toAtto } from '~/marketplace/utils/math'
import { getNativeTokenBalance } from '~/marketplace/utils/web3'
import { toBN } from '~/utils/bn'
import Spinner from '~/shared/components/Spinner'
import SvgIcon from '~/shared/components/SvgIcon'
import { Separator } from '~/components/Separator'
import { TABLET } from '~/shared/utils/styled'
import { StatCellLabelTip } from '~/components/StatGrid'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { useOperatorReachability } from '~/shared/stores/operatorReachability'

export function OperatorChecklist({ operatorId }: { operatorId: string | undefined }) {
    const { funded, nodesDeclared, nodesFunded, nodesReachable, nodesRunning } =
        useOperatorChecklist(operatorId)

    return (
        <>
            <ChecklistItem
                state={funded}
                tip={
                    <p>
                        You need to deposit <SponsorshipPaymentTokenName /> tokens into
                        your operator contract before you can stake on sponsorships or
                        receive delegations.
                    </p>
                }
            >
                Operator funded
            </ChecklistItem>
            <Separator />
            <ChecklistItem
                state={nodesDeclared}
                tip={
                    <p>
                        Configure your nodes with private keys and declare the
                        corresponding addresses to the operator contract.
                    </p>
                }
            >
                Node addresses declared
            </ChecklistItem>
            <Separator />
            <ChecklistItem
                state={nodesFunded}
                tip={
                    <p>
                        Your node addresses must be funded with some MATIC for Polygon
                        transaction fees. This alert triggers if a balance is less than
                        0.1 MATIC.
                    </p>
                }
            >
                Node addresses funded
            </ChecklistItem>
            <Separator />
            <ChecklistItem
                state={nodesRunning}
                tip={
                    <p>
                        You need to run Streamr nodes with the operator plugin enabled.
                        The nodes will do the work you sign up for when you stake on
                        sponsorships.
                    </p>
                }
            >
                Nodes running
            </ChecklistItem>
            <Separator />
            <ChecklistItem
                state={nodesReachable}
                tip={<p>The websocket port on your nodes should be reachable.</p>}
            >
                Nodes reachable
            </ChecklistItem>
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

    const heartbeats = useInterceptHeartbeats(operatorId)

    const { count, isLoading: isLoadingLiveNodes } = useOperatorLiveNodes(heartbeats)

    const nodesRunning = isLoadingLiveNodes ? undefined : count > 0

    const reachability = useOperatorReachability(heartbeats)

    const nodesReachable =
        isLoadingLiveNodes || reachability === 'probing' ? void 0 : reachability === 'all'

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

            let result = false

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

                result = true
            } catch (e) {
                if (e instanceof InsufficientFundsError) {
                    return
                }

                console.warn('Failed to check if nodes are funded', e)
            } finally {
                if (mounted) {
                    setNodesFunded(result)
                }
            }
        })

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

function ChecklistItem({
    children,
    state,
    tip = '',
}: {
    children: ReactNode
    state?: boolean
    tip?: ReactNode
}) {
    return (
        <ChecklistItemRoot>
            <div>
                {state === false && (
                    <IconWrap $color="#FF5C00">
                        <JiraFailedBuildStatusIcon label="Error" size="medium" />
                    </IconWrap>
                )}
                {typeof state === 'undefined' && (
                    <IconWrap>
                        <Spinner color="blue" />
                    </IconWrap>
                )}
                {state === true && (
                    <IconWrap $color="#0EAC1B">
                        <CheckCircleIcon label="Ok" size="medium" />
                    </IconWrap>
                )}
            </div>
            <div>{children}</div>
            {tip ? (
                <div>
                    <StatCellLabelTip
                        shift="left"
                        handle={
                            <IconWrap>
                                <QuestionMarkIcon />
                            </IconWrap>
                        }
                    >
                        {tip}
                    </StatCellLabelTip>
                </div>
            ) : (
                <></>
            )}
        </ChecklistItemRoot>
    )
}

const ChecklistItemRoot = styled.div`
    align-items: center;
    display: grid;
    gap: 20px;
    grid-template-columns: 24px 1fr 24px;
    padding: 12px 24px;

    @media ${TABLET} {
        padding: 16px 40px;
    }
`

function getQuestionMarkIconAttrs(): ComponentProps<typeof SvgIcon> {
    return { name: 'outlineQuestionMark' }
}

const QuestionMarkIcon = styled(SvgIcon).attrs(getQuestionMarkIconAttrs)`
    display: block;
    height: 16px;
    width: 16px;
`

const IconWrap = styled.div<{ $color?: string }>`
    align-items: center;
    color: ${({ $color = 'inherit' }) => $color};
    display: flex;
    height: 24px;
    justify-content: center;
    position: relative;
    width: 24px;
`
