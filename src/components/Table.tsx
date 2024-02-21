import CheckIcon from '@atlaskit/icon/glyph/check'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import moment from 'moment'
import React from 'react'
import styled, { css } from 'styled-components'
import { StreamDescription } from '~/components/StreamDescription'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { getSponsorshipStakeForOperator } from '~/utils/sponsorships'
import { OperatorAvatar } from './avatars'

/**
 * Operator name and avatar formatter.
 */
export function OperatorIdCell({
    operatorId,
    imageUrl,
    operatorName,
    truncate: truncateProp = false,
}: {
    operatorId: string
    imageUrl?: string
    operatorName?: string
    truncate?: boolean
}) {
    return (
        <OperatorIdCellRoot>
            <OperatorAvatarWrap>
                <OperatorAvatar operatorId={operatorId} imageUrl={imageUrl} />
            </OperatorAvatarWrap>
            <OperatorName $truncate={truncateProp}>
                {operatorName || truncate(operatorId)}
            </OperatorName>
        </OperatorIdCellRoot>
    )
}

const OperatorAvatarWrap = styled.div`
    height: 32px;
    width: 32px;
`

const OperatorName = styled.div<{ $truncate?: boolean }>`
    ${({ $truncate = false }) =>
        $truncate &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `}
`

const OperatorIdCellRoot = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    gap: 12px;
`

/**
 * Deleted stream id formatter.
 */
function DeletedStreamIdCell() {
    return (
        <StreamInfoCell>
            <StreamIdWrap as="em">(deleted stream)</StreamIdWrap>
        </StreamInfoCell>
    )
}

/**
 * Stream id and description formatter.
 */
export function StreamIdCell({
    streamId = '',
    description,
}: {
    streamId?: string
    description?: string
}) {
    if (!streamId) {
        return <DeletedStreamIdCell />
    }

    return (
        <StreamInfoCell>
            <StreamIdWrap>{truncateStreamName(streamId)}</StreamIdWrap>
            <StreamDescriptionWrap>
                {description == null ? (
                    <StreamDescription streamId={streamId} />
                ) : (
                    description
                )}
            </StreamDescriptionWrap>
        </StreamInfoCell>
    )
}

/**
 * Sponsorship's projected insolvency timestamp formatter.
 */
export function FundedUntilCell({
    projectedInsolvencyAt,
    isPaying,
}: {
    projectedInsolvencyAt: number | null
    isPaying: boolean
}) {
    const value =
        projectedInsolvencyAt == null ? null : moment(projectedInsolvencyAt * 1000)

    return (
        <Iconized>
            {value == null ? <>N/A</> : <>{value.format('YYYY-MM-DD')}</>}
            {!isPaying && (
                <Tooltip content="Sponsorship expired">
                    <TooltipIconWrap $color="#ff5c00">
                        <JiraFailedBuildStatusIcon label="Error" />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </Iconized>
    )
}

const Iconized = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto 18px;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`

export function NumberOfOperatorsCell({
    sponsorship,
    currentOperatorId,
}: {
    sponsorship: ParsedSponsorship
    currentOperatorId: string | undefined
}) {
    const joinedByCurrentOperator =
        !!currentOperatorId &&
        !!getSponsorshipStakeForOperator(sponsorship.stakes, currentOperatorId)

    return (
        <Iconized>
            {sponsorship.operatorCount}
            {joinedByCurrentOperator && (
                <Tooltip content="Already joined as Operator.">
                    <TooltipIconWrap $color="currentColor">
                        <CheckIcon label="Already joined as Operator." />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </Iconized>
    )
}

const StreamInfoCell = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 26px;
`

const StreamIdWrap = styled.span`
    font-weight: ${MEDIUM};
    color: ${COLORS.primary};
`

const StreamDescriptionWrap = styled.span`
    font-size: 14px;
    max-width: 208px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :empty {
        display: none;
    }
`
