import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { Button } from '~/components/Button'
import { truncate } from '~/shared/utils/text'
import { calculateUndelegationQueueSize, getDelegatedAmountForWallet } from '~/getters'
import {
    useForceUndelegate,
    useOperatorByIdQuery,
    useProcessUndelegationQueue,
} from '~/hooks/operators'
import { BN, BNish, toBN } from '~/utils/bn'
import { useConfigValueFromChain } from '~/hooks'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { abbr } from '~/utils'
import { fromAtto } from '~/marketplace/utils/math'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { useCurrentChainId } from '~/shared/stores/chain'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'

function getUndelegationExpirationDate(
    date: number,
    maxUndelegationQueueSeconds: BNish | undefined = '0',
) {
    return moment((date + toBN(maxUndelegationQueueSeconds).toNumber()) * 1000)
}

interface Props {
    operatorId: string | undefined
}

export function UndelegationQueue({ operatorId }: Props) {
    const currentChainId = useCurrentChainId()
    const operatorQuery = useOperatorByIdQuery(operatorId)
    const operator = operatorQuery.data || null

    const walletAddress = useWalletAccount()
    const { symbol: tokenSymbol = 'DATA' } = useSponsorshipTokenInfo() || {}

    const maxUndelegationQueueSeconds = useConfigValueFromChain('maxQueueSeconds')
    const forceUndelegate = useForceUndelegate()
    const processUndelegationQueue = useProcessUndelegationQueue()

    const freeFunds = operator?.dataTokenBalanceWei
    const undelegationQueueSize =
        operator != null ? calculateUndelegationQueueSize(operator) : undefined

    const isProcessButtonDisabled =
        freeFunds != null &&
        undelegationQueueSize != null &&
        freeFunds.isLessThan(undelegationQueueSize)

    const ProcessQueueButton = () => (
        <Button
            kind="secondary"
            disabled={isProcessButtonDisabled}
            onClick={() => {
                if (operatorId == null) {
                    return
                }
                processUndelegationQueue(currentChainId, operatorId)
            }}
        >
            Process queue
        </Button>
    )

    if (operator == null) {
        return null
    }

    return (
        <ScrollTable
            elements={operator.queueEntries}
            columns={[
                {
                    displayName: 'Delegator address',
                    valueMapper: (element) => (
                        <>
                            {truncate(element.delegator)}
                            {element.delegator === walletAddress?.toLowerCase() && (
                                <Badge>You</Badge>
                            )}
                        </>
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'id',
                },
                {
                    displayName: 'Amount',
                    valueMapper: (element) => (
                        <>
                            {abbr(
                                fromAtto(
                                    BN.min(
                                        getDelegatedAmountForWallet(
                                            element.delegator,
                                            operator,
                                        ),
                                        element.amount,
                                    ),
                                ),
                            )}{' '}
                            {tokenSymbol}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'amount',
                },
                {
                    displayName: 'Expiration date',
                    valueMapper: (element) => {
                        const expirationDate = getUndelegationExpirationDate(
                            element.date,
                            maxUndelegationQueueSeconds,
                        )
                        return (
                            <WarningCell>
                                {expirationDate.format('YYYY-MM-DD')}
                                {expirationDate.isBefore(Date.now()) && (
                                    <Tooltip
                                        content={
                                            <p>
                                                Payout time exceeded. You can force
                                                unstake now.
                                            </p>
                                        }
                                    >
                                        <TooltipIconWrap $color="#ff5c00">
                                            <JiraFailedBuildStatusIcon label="Error" />
                                        </TooltipIconWrap>
                                    </Tooltip>
                                )}
                            </WarningCell>
                        )
                    },
                    align: 'start',
                    isSticky: false,
                    key: 'date',
                },
                {
                    displayName: '',
                    valueMapper: (element) => (
                        <>
                            {getUndelegationExpirationDate(
                                element.date,
                                maxUndelegationQueueSeconds,
                            ).isBefore(Date.now()) && (
                                <Button
                                    type="button"
                                    kind="secondary"
                                    onClick={() => {
                                        forceUndelegate(
                                            currentChainId,
                                            operator,
                                            element.amount,
                                        )
                                    }}
                                >
                                    Force unstake
                                </Button>
                            )}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'actions',
                },
            ]}
            footerComponent={
                operator.queueEntries.length > 0 ? (
                    <Footer>
                        {isProcessButtonDisabled ? (
                            <Tooltip content="The Operator needs to unstake to free up funds to pay out the queue">
                                <ProcessQueueButton />
                            </Tooltip>
                        ) : (
                            <ProcessQueueButton />
                        )}
                    </Footer>
                ) : null
            }
        />
    )
}

const Badge = styled.div`
    border-radius: 8px;
    background: ${COLORS.secondary};
    color: ${COLORS.primaryLight};
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 30px;
    letter-spacing: 0.14px;
    padding: 0px 10px;
    margin-left: 12px;
`

const WarningCell = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`

const Footer = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
`
