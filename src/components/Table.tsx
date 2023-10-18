import React from 'react'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import moment from 'moment'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { StreamInfoCell } from '~/components/NetworkUtils'
import { StreamDescription } from '~/components/StreamDescription'
import { Tip, TipIconWrap } from '~/components/Tip'

/**
 * Operator name and avatar formatter.
 */
export function OperatorIdCell({
    operatorId,
    imageUrl,
    operatorName,
}: {
    operatorId: string
    imageUrl?: string
    operatorName?: string
}) {
    return (
        <OperatorIdCellRoot>
            {imageUrl ? (
                <HubImageAvatar src={imageUrl} alt={imageUrl || operatorId} />
            ) : (
                <HubAvatar id={operatorId} />
            )}
            <span>{operatorName || truncate(operatorId)}</span>
        </OperatorIdCellRoot>
    )
}

const OperatorIdCellRoot = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 12px;
`

/**
 * Stream id and description formatter.
 */
export function StreamIdCell({ streamId }: { streamId: string }) {
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
    projectedInsolvencyAt: number
}) {
    const value = moment(projectedInsolvencyAt * 1000)

    return (
        <FundedUntilCellRoot>
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
        </FundedUntilCellRoot>
    )
}

const FundedUntilCellRoot = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`
