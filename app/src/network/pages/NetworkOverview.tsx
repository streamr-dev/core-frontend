import React from 'react'
import styled from 'styled-components'
import styles from '$mp/containers/Projects/projects.pcss'
import Layout, { PageContainer } from '$shared/components/Layout'
import { NetworkHelmet } from '$shared/components/Helmet'
import {
    WhiteBox,
    WhiteBoxPaddingStyles,
    WhiteBoxSeparator,
} from '$shared/components/WhiteBox'
import { TABLET } from '$shared/utils/styled'
import { NetworkSectionTitle } from '$app/src/network/components/NetworkSectionTitle'
import { StatsBox } from '$shared/components/StatsBox/StatsBox'
import { NetworkSearchBar } from '../components/NetworkSearchBar'

export const NetworkStats = styled(WhiteBox)`
    margin-top: 32px;

    @media (${TABLET}) {
        margin-top: 60px;
    }

    .title {
        ${WhiteBoxPaddingStyles}
    }
`

export const NetworkOverview = () => {
    const stubNetworkStats = [
        {
            label: 'Total stake',
            value: '12M DATA',
        },
        { label: 'Sponsorships', value: '234' },
        { label: 'Operators', value: '1345' },
    ]

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Network Overview" />
            <NetworkSearchBar />
            <PageContainer>
                <NetworkStats>
                    <div className="title">
                        <NetworkSectionTitle>Network stats</NetworkSectionTitle>
                    </div>
                    <WhiteBoxSeparator />
                    <StatsBox stats={stubNetworkStats} columns={3} />
                </NetworkStats>
            </PageContainer>
        </Layout>
    )
}
