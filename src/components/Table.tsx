import React from 'react'
import styled, { css } from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import CheckIcon from '@atlaskit/icon/glyph/check'
import moment from 'moment'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { StreamInfoCell } from '~/components/NetworkUtils'
import { StreamDescription } from '~/components/StreamDescription'
import { Tip, TipIconWrap } from '~/components/Tip'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { getSponsorshipStakeForOperator } from '~/utils/sponsorships'

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
            {imageUrl ? (
                <HubImageAvatar
                    src={imageUrl}
                    alt=""
                    placeholder={<HubAvatar id={operatorId} />}
                />
            ) : (
                <HubAvatar id={operatorId} />
            )}
            <OperatorName $truncate={truncateProp}>
                {operatorName || truncate(operatorId)}
            </OperatorName>
        </OperatorIdCellRoot>
    )
}

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
            <em className="stream-id">(deleted stream)</em>
        </StreamInfoCell>
    )
}

/**
 * Stream id and description formatter.
 */
export function StreamIdCell({ streamId = '' }: { streamId?: string }) {
    if (!streamId) {
        return <DeletedStreamIdCell />
    }

    return (
        <StreamInfoCell>
            <span className="stream-id">{truncateStreamName(streamId)}</span>
            <span className="stream-description">
                <StreamDescription streamId={streamId} />
            </span>
        </StreamInfoCell>
    )
}

/**
 * Sponsorship's projected insolvency timestamp formatter.
 */
export function FundedUntilCell({
    projectedInsolvencyAt,
}: {
    projectedInsolvencyAt: number | null
}) {
    const value =
        projectedInsolvencyAt == null ? null : moment(projectedInsolvencyAt * 1000)

    return (
        <Iconized>
            {value == null ? (
                <>N/A</>
            ) : (
                <>
                    {value.format('YYYY-MM-DD')}
                    {value.isBefore(Date.now()) && (
                        <Tip
                            handle={
                                <TipIconWrap $color="#ff5c00">
                                    <JiraFailedBuildStatusIcon label="Error" />
                                </TipIconWrap>
                            }
                        >
                            Sponsorship expired
                        </Tip>
                    )}
                </>
            )}
        </Iconized>
    )
}

const Iconized = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TipIconWrap} svg {
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
                <Tip
                    handle={
                        <TipIconWrap $color="currentColor">
                            <CheckIcon label="Already joined as Operator." />
                        </TipIconWrap>
                    }
                >
                    Already joined as Operator.
                </Tip>
            )}
        </Iconized>
    )
}
