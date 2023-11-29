import React from 'react'
import styled from 'styled-components'
import NetworkPageSegment from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import { useAllSponsorshipsQuery } from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'

type Props = {
    streamId: string
}

const PAGE_SIZE = 5

export default function SponsorshipsTable({ streamId }: Props) {
    const { orderBy, orderDirection, handleOrderChange } = useTableOrder()

    const allSponsorshipsQuery = useAllSponsorshipsQuery({
        pageSize: PAGE_SIZE,
        searchQuery: undefined,
        orderBy,
        orderDirection,
    })

    return (
        <Root>
            <NetworkPageSegment title="Sponsorships">
                <QueriedSponsorshipsTable
                    query={allSponsorshipsQuery}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onOrderChange={handleOrderChange}
                />
            </NetworkPageSegment>
        </Root>
    )
}

const Root = styled.div`
    margin-top: 24px;
`
