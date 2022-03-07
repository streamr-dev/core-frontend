import React from 'react'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import styled, { css } from 'styled-components'

import { formatDateTime } from '$mp/utils/time'
import { MD, LG } from '$shared/utils/styled'

const tz = moment.tz.guess()

const Row = styled.div`
    border-bottom: 1px solid #EBEBEB;
    display: grid;
    grid-template-columns: minmax(190px, auto) 1fr;

    ${({ highlight }) => !!highlight && css`
        cursor: pointer;

        &:hover {
            background-color: #F8F8F8;
        }
    `} 

    @media (min-width: ${LG}px) {
        grid-template-columns: minmax(230px, auto) 1fr;
    }
`

const Column = styled.div`
    color: var(--fontColor);
    font-size: 12px;
    line-height: 48px;
    padding: 0 1.5rem;
    white-space: nowrap;

    strong {
        color: #323232;
        font-family: var(--sans);
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
    }

    &:last-child {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        border-left: 1px solid #EBEBEB;
    }

    &:empty::after {
        content: ' ';
        white-space: pre;
    }

    @media (min-width: ${MD}px) {
        font-size: 14px;
        line-height: 56px;
    }
`

const DataTable = styled.div`
    width: 100%;
    margin: 0;
    overflow: hidden;
`

const prettyPrintData = (data, compact = false) => stringifyObject(data, {
    indent: '  ',
    inlineCharacterLimit: compact ? Infinity : 5,
})

const PreviewTable = ({ streamData }) => (
    <div>
        <DataTable>
            <Row>
                <Column>
                    <strong>Timestamp</strong>
                </Column>
                <Column>
                    <strong>Data</strong>
                </Column>
            </Row>
            {[...Array(5).fill(undefined), ...(streamData || [])].slice(-20).map((d, index) => {
                if (!d) {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <Row key={index}>
                            <Column />
                            <Column />
                        </Row>
                    )
                }

                return (
                    <Row
                        key={JSON.stringify(d.metadata.messageId)}
                        highlight
                    >
                        <Column>
                            {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                        </Column>
                        <Column>
                            {prettyPrintData(d.data, true)}
                        </Column>
                    </Row>
                )
            })}
        </DataTable>
    </div>
)

export default PreviewTable
