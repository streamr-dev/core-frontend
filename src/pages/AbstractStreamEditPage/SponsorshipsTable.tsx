import React from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import NetworkPageSegment, { TitleBar } from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
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
    const { orderBy, orderDirection, setOrder } = useTableOrder()

    const wallet = useWalletAccount()

    const createSponsorship = useCreateSponsorship()

    const chainId = useCurrentChainId()

    const query = useSponsorshipsByStreamIdQuery({
        pageSize: PAGE_SIZE,
        streamId,
        orderBy,
        orderDirection,
    })

    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    return (
        <NetworkPageSegment
            title={
                <TitleBar
                    label={sponsorships.length || undefined}
                    aux={
                        sponsorships.length > 0 && (
                            <CreateButton
                                type="button"
                                onClick={() =>
                                    createSponsorship(chainId, wallet, { streamId })
                                }
                                disabled={streamId == null || wallet == null}
                            >
                                Create
                            </CreateButton>
                        )
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
