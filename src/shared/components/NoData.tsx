import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import emptyStateIcon from '~/shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '~/shared/assets/images/empty_state_icon@2x.png'
import EmptyState from '~/shared/components/EmptyState'

type Props = {
    firstLine: ReactNode
    secondLine?: ReactNode
    width?: number //px
    compact?: boolean
}
export const NoData: FunctionComponent<Props> = ({
    firstLine,
    secondLine,
    width,
    compact,
}) => {
    return (
        <EmptyStateWrap
            image={
                <img
                    src={emptyStateIcon}
                    srcSet={`${emptyStateIcon2x} 2x`}
                    alt="Not found"
                    style={
                        width
                            ? { width: `${width}px`, height: 'auto', maxWidth: '100%' }
                            : {}
                    }
                />
            }
            compact={compact}
        >
            <EmptyStateParagraph>{firstLine}</EmptyStateParagraph>
            {secondLine && <EmptyStateParagraph>{secondLine}</EmptyStateParagraph>}
        </EmptyStateWrap>
    )
}

const EmptyStateWrap = styled(EmptyState)<{ compact?: boolean }>`
    padding: ${({ compact }) => (compact ? '48px' : '150px')} 0;
`

const EmptyStateParagraph = styled.p`
    font-size: 16px;
    margin-bottom: 0;
`
