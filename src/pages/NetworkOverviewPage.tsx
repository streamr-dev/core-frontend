import React from 'react'
import styled from 'styled-components'
import Layout from '~/components/Layout'
import { PageContainer } from '~/shared/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import {
    WhiteBox,
    WhiteBoxPaddingStyles,
    WhiteBoxSeparator,
} from '~/shared/components/WhiteBox'
import { MD, TABLET } from '~/shared/utils/styled'
import { NetworkSectionTitle } from '~/components/NetworkSectionTitle'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { MyOperatorSummary } from '../components/MyOperatorSummary'
import { MyDelegationsSummary } from '../components/MyDelegationsSummary'
import { MyDelegationsTable } from '../components/MyDelegationsTable'
import { MySponsorshipsTable } from '../components/MySponsorshiptsTable'

export const NetworkStats = styled(WhiteBox)`
    margin-top: 32px;
    margin-bottom: 24px;

    @media (${TABLET}) {
        margin-top: 60px;
    }

    .title {
        ${WhiteBoxPaddingStyles}
    }

    .stat-box-wrap {
        @media (max-width: ${MD}px) {
            ${WhiteBoxPaddingStyles};
            padding-top: 0;
            padding-bottom: 0;
        }
    }
`

export const NetworkOverviewPage = () => {
    const stubNetworkStats = [
        {
            label: 'Total stake',
            value: '12M DATA',
        },
        { label: 'Sponsorships', value: '234' },
        { label: 'Operators', value: '1345' },
    ]

    return (
        <Layout>
            <NetworkHelmet title="Network Overview" />
            <PageContainer>
                <NetworkStats>
                    <div className="title">
                        <NetworkSectionTitle>Network stats</NetworkSectionTitle>
                    </div>
                    <WhiteBoxSeparator />
                    <div className="stat-box-wrap">
                        <StatsBox stats={stubNetworkStats} columns={3} />
                    </div>
                </NetworkStats>
                <MyOperatorSummary />
                <MyDelegationsSummary />
                <MyDelegationsTable />
                <MySponsorshipsTable />
            </PageContainer>
        </Layout>
    )
}
