import { useQuery } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { getIndexerClient } from '~/getters/getGraphClient'
import {
    GetStreamsDocument,
    GetStreamsQuery,
    GetStreamsQueryVariables,
} from '../generated/gql/indexer'

type StatProps = {
    id: string
    label: ReactNode
    value?: ReactNode
    unit?: ReactNode
}

function Stat({ label, value, unit, ...props }: StatProps) {
    return (
        <StatRoot type="button" {...props}>
            <StatName>{label}</StatName>
            <StatValue>
                {value !== undefined && value}
                {value === undefined && <Dimm>&infin;</Dimm>}
                {value !== undefined && unit}
            </StatValue>
        </StatRoot>
    )
}

const StatName = styled.div`
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.05em;
    color: #adadad;
    text-transform: uppercase;
`

const StatValue = styled.div`
    font-size: 16px;
    line-height: normal;
    margin-top: 0.25em;
    color: #323232;

    svg {
        width: 13px;
        height: 13px;
        color: #adadad;
    }
`

const Dimm = styled.span`
    color: #adadad;
`

export const StatRoot = styled.button`
    background: transparent;
    border: 0;
    appearance: none;
    text-align: center;
    user-select: none;
    position: relative;
    font-family: inherit;
    outline: none;

    &:focus {
        outline: none;
    }

    ${StatName} {
        transition: color 300ms ease-in-out;
    }
`

const ButtonGrid = styled.div`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
    display: flex;
    flex-direction: row;
    padding: 16px 0;

    > ${StatRoot} {
        flex-grow: 1;
        flex-basis: 0;
    }
`

function useStreamStatsQuery(streamId: string) {
    return useQuery({
        queryKey: ['useStreamStatsQuery', streamId],
        queryFn: async () => {
            const client = getIndexerClient(137)

            if (!client) {
                return defaultStreamStats
            }

            const {
                data: { streams },
            } = await client.query<GetStreamsQuery, GetStreamsQueryVariables>({
                query: GetStreamsDocument,
                variables: {
                    streamIds: [streamId],
                    first: 1,
                },
            })

            const [stream = undefined] = streams.items

            if (!stream) {
                return null
            }

            const { messagesPerSecond, peerCount } = stream

            return {
                latency: undefined as undefined | number,
                messagesPerSecond,
                peerCount,
            }
        },
    })
}

interface StreamStatsProps {
    streamId: string
}

const defaultStreamStats = {
    latency: undefined,
    messagesPerSecond: undefined,
    peerCount: undefined,
}

export function StreamStats({ streamId }: StreamStatsProps) {
    const { data: stats } = useStreamStatsQuery(streamId)

    const { messagesPerSecond, peerCount, latency } = stats || defaultStreamStats

    return (
        <StreamStatsRoot>
            <ButtonGrid>
                <Stat
                    id="streamMessagesPerSecond"
                    label="Msgs / sec"
                    value={messagesPerSecond}
                />
                <Stat id="peerCount" label="Peers" value={peerCount} />
                <Stat
                    id="latency"
                    label="Latency ms"
                    value={latency == null ? undefined : latency.toFixed(2)}
                />
            </ButtonGrid>
        </StreamStatsRoot>
    )
}

const StreamStatsRoot = styled.div`
    padding: 24px;
    position: absolute;
    top: 0;
    width: 100%;
    max-width: 480px;
`
