import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import NetworkPageSegment, { TitleBar } from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    SponsorshipFilterButton,
    SponsorshipFilters,
} from '~/components/SponsorshipFilterButton'
import {
    useCreateSponsorship,
    useSponsorshipsByStreamIdQuery,
} from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import { NoData } from '~/shared/components/NoData'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useCurrentChainId } from '~/utils/chains'
import { Route as R } from '~/utils/routes'

type Props = {
    streamId: string
}

const PAGE_SIZE = 5

export default function SponsorshipsTable({ streamId }: Props) {
    const [filters, setFilters] = useState<SponsorshipFilters>({
        expired: false,
        inactive: false,
        my: false,
        noFunding: false,
    })

    const {
        orderBy = 'remainingWei',
        orderDirection = 'desc',
        setOrder,
    } = useTableOrder()

    const wallet = useWalletAccount()

    const createSponsorship = useCreateSponsorship()

    const chainId = useCurrentChainId()

    const query = useSponsorshipsByStreamIdQuery({
        pageSize: PAGE_SIZE,
        streamId,
        orderBy,
        orderDirection,
        filters,
    })

    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    return (
        <NetworkPageSegment
            title={
                <TitleBar
                    aux={
                        <>
                            {sponsorships.length > 0 && (
                                <>
                                    <CreateButton
                                        type="button"
                                        onClick={() =>
                                            createSponsorship(chainId, wallet, {
                                                streamId,
                                            })
                                        }
                                        disabled={streamId == null || wallet == null}
                                    >
                                        Create
                                    </CreateButton>
                                    <Separator />
                                </>
                            )}
                            <SponsorshipFilterButton
                                filter={filters}
                                onFilterChange={setFilters}
                            />
                        </>
                    }
                >
                    Active Stream Sponsorships
                </TitleBar>
            }
        >
            {sponsorships.length > 0 ? (
                <QueriedSponsorshipsTable
                    query={query}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onOrderChange={setOrder}
                    hideStreamId
                />
            ) : (
                <NoDataContainer>
                    <NoData
                        firstLine="This stream does not have any Sponsorships yet."
                        secondLine={
                            <span>
                                <a
                                    href={R.docs(
                                        '/streamr-network/incentives/stream-sponsorships',
                                    )}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    Stream Sponsorships
                                </a>{' '}
                                incentivize node operators to relay the
                                <br /> stream&apos;s data, which enhances its
                                connectability and robustness.
                            </span>
                        }
                        compact
                    />
                    <CreateButton
                        type="button"
                        onClick={() => {
                            createSponsorship(chainId, wallet, { streamId })
                        }}
                        disabled={streamId == null || wallet == null}
                    >
                        Create Sponsorship
                    </CreateButton>
                </NoDataContainer>
            )}
        </NetworkPageSegment>
    )
}

const NoDataContainer = styled.div`
    display: grid;
    padding: 80px;
`

const CreateButton = styled(Button)`
    width: fit-content;
    justify-self: center;
`

const Separator = styled.div`
    width: 1px;
    height: 1rem;
    background: #f0f0f0;
    margin: 0 8px;
`
