import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from '$shared/components/Layout'
import {
    ActionBarContainer,
    FiltersBar,
    FiltersWrap,
    SearchBarWrap,
} from '$mp/components/ActionBar/actionBar.styles'
import { PageWrap } from '$shared/components/PageWrap'
import styles from '$shared/components/Layout/layout.pcss'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import { useWalletAccount } from '$shared/stores/wallet'
import { ScrollTable } from '$shared/components/ScrollTable/ScrollTable'
import { createSponsorship, getAllSponsorships } from '../services/sponsorships'

const PAGE_SIZE = 10

const Container = styled.div`
    color: ${COLORS.primary};
    background-color: ${COLORS.secondary};

    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 0 130px;
    }
`

const TableContainer = styled.div`
    border-radius: 16px;
    background-color: white;
`

const SponsorshipsPage: React.FC = () => {
    const account = useWalletAccount()

    const sponsorshipsQuery = useInfiniteQuery({
        queryKey: ['sponsorships'],
        queryFn: async (ctx) => {
            return getAllSponsorships({ first: PAGE_SIZE })
        },
        getNextPageParam: (lastPage) => {
            return 0
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    return (
        <Layout innerClassName={styles.greyInner}>
            <MarketplaceHelmet title="Sponsorships" />
            <ActionBarContainer>
                <SearchBarWrap></SearchBarWrap>
                <FiltersBar>
                    <FiltersWrap></FiltersWrap>
                    <Button
                        tag={Link}
                        onClick={() => {
                            createSponsorship({
                                initialMinimumStakeWei: 1,
                                initialMinHorizonSeconds: 1,
                                initialMinOperatorCount: 1,
                                streamId:
                                    '0xa3d1f77acff0060f7213d7bf3c7fec78df847de1/test',
                                metadata: {
                                    field: 'test',
                                },
                                policies: [],
                                initParams: [],
                            })
                        }}
                    >
                        Create sponsorship
                    </Button>
                </FiltersBar>
            </ActionBarContainer>
            <LoadingIndicator
                loading={
                    sponsorshipsQuery.isLoading ||
                    sponsorshipsQuery.isFetching ||
                    sponsorshipsQuery.isFetchingNextPage
                }
            />
            <PageWrap>
                <Container>
                    <TableContainer>
                        <ScrollTable
                            title="Sponsorships"
                            columns={[
                                {
                                    key: 'streamId',
                                    displayName: 'Stream ID',
                                    isSticky: true,
                                    valueMapper: (element) => element.stream?.id,
                                    align: 'start',
                                },
                                {
                                    key: 'staked',
                                    displayName: 'Staked',
                                    isSticky: true,
                                    valueMapper: (element) => element.totalStakedWei,
                                    align: 'start',
                                },
                            ]}
                            elements={
                                sponsorshipsQuery.data?.pages.flatMap(
                                    (p) => p.sponsorships,
                                ) ?? []
                            }
                        />
                    </TableContainer>
                </Container>
            </PageWrap>
        </Layout>
    )
}

export default SponsorshipsPage
