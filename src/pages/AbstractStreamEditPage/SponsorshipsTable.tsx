import React, { useCallback } from 'react'
import styled from 'styled-components'
import NetworkPageSegment from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    invalidateSponsorshipQueries,
    useSponsorshipsByStreamIdQuery,
} from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import Button from '~/shared/components/Button'
import { NoData } from '~/shared/components/NoData'
import { createSponsorshipModal } from '~/modals/CreateSponsorshipModal'
import { getBalanceForSponsorship } from '~/utils/sponsorships'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isRejectionReason } from '~/modals/BaseModal'
import { COLORS } from '~/shared/utils/styled'

type Props = {
    streamId: string
}

const PAGE_SIZE = 5

export default function SponsorshipsTable({ streamId }: Props) {
    const { orderBy, orderDirection, handleOrderChange } = useTableOrder()
    const wallet = useWalletAccount()

    const query = useSponsorshipsByStreamIdQuery({
        pageSize: PAGE_SIZE,
        streamId,
        orderBy,
        orderDirection,
    })

    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    const createSponsorship = useCallback(async () => {
        if (!wallet) {
            return
        }

        try {
            const balance = await getBalanceForSponsorship(wallet)

            const sponsorshipId = await createSponsorshipModal.pop({
                balance,
                streamId,
            })

            invalidateSponsorshipQueries(wallet, sponsorshipId, streamId)
        } catch (e) {
            if (isRejectionReason(e)) {
                return
            }

            throw e
        }
    }, [streamId, wallet])

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
                                onClick={createSponsorship}
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
                            compact
                        />
                        <CreateButton
                            type="button"
                            onClick={createSponsorship}
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
