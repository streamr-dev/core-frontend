import React from 'react'
import styled from 'styled-components'
import { BehindIndexError } from '~/errors/BehindIndexError'
import { COLORS } from '~/shared/utils/styled'
import Spinner from './Spinner'
import { Tooltip } from './Tooltip'

interface BehindBlockErrorDisplayProps {
    value: BehindIndexError
}

export function BehindBlockErrorDisplay({ value }: BehindBlockErrorDisplayProps) {
    const togo = value.remaining() - value.completed()

    return (
        <Root>
            <Spinner fixed coverage={value.progress()} size={24} strokeWidth={3} />
            <h2>Indexing</h2>
            <p>
                Your resource is being indexed.
                <br />
                It will be available shortly.
            </p>
            <Tooltip
                content={`${value.actualBlockNumber} / ${value.expectedBlockNumber}`}
                anchorDisplay="inline-block"
            >
                <Blocks>
                    {togo} block{togo !== 1 ? 's' : ''} to go
                </Blocks>
            </Tooltip>
        </Root>
    )
}

const Root = styled.div`
    padding: 240px 0;
    text-align: center;

    ${Spinner} {
        margin: 0 auto;
    }

    p {
        margin: 12px 0 16px;
        line-height: 1.5em;
    }

    h2 {
        font-weight: normal;
        font-size: 24px;
        margin: 20px 0 0;
    }
`

const Blocks = styled.div`
    align-items: center;
    background: #fafafa;
    border-radius: 16px;
    color: ${COLORS.primaryLight};
    display: flex;
    font-size: 14px;
    gap: 4px;
    height: 32px;
    margin: 0 auto;
    padding: 0 12px;
    width: max-content;
`
