import React from 'react'
import styled from 'styled-components'
import NetworkPageSegment from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    useCreateSponsorship,
    useSponsorshipsByStreamIdQuery,
} from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import { Button } from '~/components/Button'
import { NoData } from '~/shared/components/NoData'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'

type Props = {
    streamId: string
}

const PAGE_SIZE = 5

export default function SponsorshipsTable({ streamId }: Props) {
    const { orderBy, orderDirection, handleOrderChange } = useTableOrder()
    const wallet = useWalletAccount()
    const createSponsorship = useCreateSponsorship()

    const query = useSponsorshipsByStreamIdQuery({
        pageSize: PAGE_SIZE,
        streamId,
        orderBy,
        orderDirection,
    })

    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    return (
        <Root>
            <NetworkPageSegment
                title={
                    <TitleBar>
                        <TitleWithCount>
                            <span>Sponsorships</span>
                            {sponsorships.length > 0 && (
                                <Count>{sponsorships.length}</Count>
                            )}
                        </TitleWithCount>
                        {sponsorships.length > 0 && (
                            <CreateButton
                                type="button"
                                onClick={() => createSponsorship(wallet, { streamId })}
                                disabled={streamId == null || wallet == null}
                            >
                                Create
                            </CreateButton>
                        )}
                    </TitleBar>
                }
            >
                {sponsorships.length > 0 ? (
                    <QueriedSponsorshipsTable
                        query={query}
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        onOrderChange={handleOrderChange}
                        hideStreamId
                    />
                ) : (
                    <NoDataContainer>
                        <NoData
                            firstLine="This stream does not have any Sponsorships yet."
                            secondLine={
                                <span>
                                    <a
                                        href="https://docs.streamr.network/streamr-network/incentives/stream-sponsorships"
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
                            onClick={() => createSponsorship(wallet, { streamId })}
                            disabled={streamId == null || wallet == null}
                        >
                            Create Sponsorship
                        </CreateButton>
                    </NoDataContainer>
                )}
            </NetworkPageSegment>
        </Root>
    )
}

const Root = styled.div`
    margin-top: 24px;
`

const NoDataContainer = styled.div`
    display: grid;
    padding: 80px;
`

const CreateButton = styled(Button)`
    width: fit-content;
    justify-self: center;
`

const TitleBar = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`

const TitleWithCount = styled.h2`
    display: flex;
    align-items: center;
`

const Count = styled.div`
    background-color: ${COLORS.secondary};
    border-radius: 50%;
    margin-left: 10px;
    width: 30px;
    font-size: 14px;
    text-align: center;
`
