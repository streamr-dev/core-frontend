import React, { useCallback, useEffect, useState } from 'react'
import { toaster } from 'toasterhea'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import { Layer } from '~/utils/Layer'
import { truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import { LoadMoreButton } from '~/components/LoadMore'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { createSponsorship } from '~/services/sponsorships'
import routes from '~/routes'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import { SponsorshipElement } from '~/types/sponsorship'
import { useFundSponsorship } from '~/hooks/useFundSponsorship'
import {
    useAllSponsorshipsQuery,
    useMySponsorshipsQuery,
} from '~/hooks/useSponsorshipsList'
import { useJoinSponsorship } from '~/hooks/useJoinSponsorship'
import { useEditStake } from '~/hooks/useEditStake'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { StreamInfoCell } from '~/components/NetworkUtils'
import {
    getTokenAndBalanceForSponsorship,
    TokenAndBalanceForSponsorship,
} from '~/getters/getTokenAndBalanceForSponsorship'

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

const PAGE_SIZE = 20

enum TabOptions {
    allSponsorships = 'allSponsorships',
    mySponsorships = 'mySponsorships',
}
export const SponsorshipsPage = () => {
    const isMounted = useIsMounted()
    const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.allSponsorships)
    const [balanceData, setBalanceData] = useState<TokenAndBalanceForSponsorship | null>(
        null,
    )
    const [searchQuery, setSearchQuery] = useState<string>('')
    const wallet = useWalletAccount()
    const walletConnected = !!wallet

    const fundSponsorship = useFundSponsorship()

    const allSponsorshipsQuery = useAllSponsorshipsQuery(PAGE_SIZE, searchQuery)

    const mySponsorshipsQuery = useMySponsorshipsQuery(PAGE_SIZE, searchQuery)

    const { canJoinSponsorship, joinSponsorship } = useJoinSponsorship()
    const { canEditStake, editStake } = useEditStake()

    const sponsorshipsQuery =
        selectedTab === TabOptions.allSponsorships
            ? allSponsorshipsQuery
            : mySponsorshipsQuery

    const sponsorships: SponsorshipElement[] =
        sponsorshipsQuery.data?.pages.map((page) => page.elements).flat() || []

    const handleSearch = useCallback(
        (searchTerm: string) => {
            setSearchQuery(searchTerm)
        },
        [setSearchQuery],
    )

    const handleTabChange = useCallback(
        (tab: string) => {
            setSelectedTab(tab as TabOptions)
        },
        [setSelectedTab],
    )

    useEffect(() => {
        if (!walletConnected && selectedTab === TabOptions.mySponsorships) {
            setSelectedTab(TabOptions.allSponsorships)
        }
    }, [walletConnected, selectedTab, setSelectedTab])

    useEffect(() => {
        if (wallet) {
            getTokenAndBalanceForSponsorship(wallet).then((balanceInfo) => {
                if (isMounted()) {
                    setBalanceData(balanceInfo)
                }
            })
        }
    }, [wallet, isMounted])

    useEffect(() => {
        sponsorshipsQuery.refetch()
    }, [selectedTab])

    const refetchQueries = async () => {
        await allSponsorshipsQuery.refetch()
        await mySponsorshipsQuery.refetch()
    }

    return (
        <Layout>
            <NetworkHelmet title="Sponsorships" />
            <NetworkActionBar
                searchEnabled
                onSearch={handleSearch}
                leftSideContent={
                    <Tabs
                        onSelectionChange={handleTabChange}
                        selection={selectedTab}
                        fullWidthOnMobile
                    >
                        <Tab id={TabOptions.allSponsorships}>All sponsorships</Tab>
                        <Tab id={TabOptions.mySponsorships} disabled={!walletConnected}>
                            My sponsorships
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    <Button
                        onClick={async () => {
                            if (balanceData) {
                                try {
                                    await createSponsorshipModal.pop({
                                        balance: balanceData.balance,
                                        tokenSymbol: balanceData.tokenSymbol,
                                        tokenDecimals: balanceData.tokenDecimals,
                                        onSubmit: async (formData) => {
                                            await createSponsorship(formData, balanceData)
                                        },
                                    })
                                    await waitForGraphSync()
                                    await refetchQueries()
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }
                        }}
                        disabled={!walletConnected || !balanceData}
                    >
                        Create sponsorship
                    </Button>
                }
            />
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={
                            <>
                                {selectedTab === TabOptions.allSponsorships ? (
                                    <>All sponsorships</>
                                ) : (
                                    <>My sponsorships</>
                                )}
                            </>
                        }
                    >
                        <ScrollTableCore
                            elements={sponsorships}
                            isLoading={
                                sponsorshipsQuery.isLoading ||
                                sponsorshipsQuery.isFetching ||
                                sponsorshipsQuery.isFetchingNextPage
                            }
                            columns={[
                                {
                                    displayName: 'Stream ID',
                                    valueMapper: (element) => (
                                        <StreamInfoCell>
                                            <span className="stream-id">
                                                {truncateStreamName(element.streamId)}
                                            </span>
                                            {element.streamDescription && (
                                                <span className="stream-description">
                                                    {element.streamDescription}
                                                </span>
                                            )}
                                        </StreamInfoCell>
                                    ),
                                    align: 'start',
                                    isSticky: true,
                                    key: 'streamInfo',
                                },
                                {
                                    displayName: balanceData
                                        ? `${balanceData.tokenSymbol}/day`
                                        : 'DATA/day',
                                    valueMapper: (element) => element.payoutPerDay,
                                    align: 'start',
                                    isSticky: false,
                                    key: 'payoutPerDay',
                                },
                                {
                                    displayName: 'Operators',
                                    valueMapper: (element) => element.operators,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'operators',
                                },
                                {
                                    displayName: 'Staked',
                                    valueMapper: (element) =>
                                        truncateNumber(
                                            Number(element.totalStake),
                                            'thousands',
                                        ),
                                    align: 'end',
                                    isSticky: false,
                                    key: 'staked',
                                },
                                {
                                    displayName: 'APY',
                                    valueMapper: (element) => element.apy + '%',
                                    align: 'end',
                                    isSticky: false,
                                    key: 'apy',
                                },
                            ]}
                            actions={[
                                {
                                    displayName: 'Sponsor',
                                    disabled: !walletConnected,
                                    callback: (element) =>
                                        fundSponsorship(
                                            element.id,
                                            element.payoutPerDay,
                                        ).then(async () => {
                                            await waitForGraphSync()
                                            await refetchQueries()
                                        }),
                                },
                                {
                                    displayName: (element) =>
                                        canEditStake(element)
                                            ? 'Edit stake'
                                            : 'Join As Operator',
                                    disabled: (element) =>
                                        canEditStake(element)
                                            ? false
                                            : !walletConnected || !canJoinSponsorship,
                                    callback: (element) =>
                                        canEditStake(element)
                                            ? editStake(element).then(async () => {
                                                  await waitForGraphSync()
                                                  await refetchQueries()
                                              })
                                            : joinSponsorship(
                                                  element.id,
                                                  element.streamId,
                                              ).then(async () => {
                                                  await waitForGraphSync()
                                                  await refetchQueries()
                                              }),
                                },
                            ]}
                            noDataFirstLine={
                                selectedTab === TabOptions.allSponsorships
                                    ? 'No sponsorships found.'
                                    : 'You do not have any sponsorships yet.'
                            }
                            linkMapper={(element) =>
                                routes.network.sponsorship({ id: element.id })
                            }
                        />
                        {sponsorshipsQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    sponsorshipsQuery.isLoading ||
                                    sponsorshipsQuery.isFetching
                                }
                                onClick={() => sponsorshipsQuery.fetchNextPage()}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        )}
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}
