import React from 'react'
import { useParams } from 'react-router-dom'
import styles from '~/marketplace/containers/Projects/projects.pcss'
import { NetworkHelmet } from '~/shared/components/Helmet'
import Layout, { PageContainer } from '~/shared/components/Layout'
import { useSponsorship } from '~/network/hooks/useSponsorship'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { SponsorshipActionBar } from '~/network/components/ActionBars/SponsorshipActionBar'

export const SingleSponsorshipPage = () => {
    const sponsorshipId = useParams().id
    const sponsorshipQuery = useSponsorship(sponsorshipId || '')
    console.log(sponsorshipId, sponsorshipQuery.data)
    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Sponsorship" />
            <LoadingIndicator
                loading={sponsorshipQuery.isLoading || sponsorshipQuery.isFetching}
            />
            {!!sponsorshipQuery.data && (
                <SponsorshipActionBar sponsorship={sponsorshipQuery.data} />
            )}
            <PageContainer>
                {sponsorshipQuery.data == null ? (
                    <NoData firstLine={'Sponsorship not found.'} />
                ) : (
                    <></>
                )}
            </PageContainer>
        </Layout>
    )
}
