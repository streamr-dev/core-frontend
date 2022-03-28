// @flow

import React from 'react'
import styled from 'styled-components'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import EmptyState from '$shared/components/EmptyState'
import marketplaceIcon from '$shared/assets/images/marketplace.png'
import marketplaceIcon2x from '$shared/assets/images/marketplace@2x.png'
import { MD } from '$shared/utils/styled'

import styles from './comingsoon.pcss'

const Text = styled.small`
    max-width: 600px;
    margin: 0 auto;
    padding: 1em 3em 0 3em;

    @media (min-width: ${MD}px) {        
        padding: 1em 0 0 0;
    }
`

const Info = () => (
    <EmptyState
        image={(
            <img
                src={marketplaceIcon}
                srcSet={`${marketplaceIcon2x} 2x`}
                alt="Marketplace"
            />
        )}
    >
        <p>
            <span>
                Coming soon
            </span>
            <Text>
                We&apos;re reworking the Marketplace to make it multi-chain, and it will relaunch in Q2/2022.
                This will make transaction fees a tiny fraction of what they were on Ethereum mainnet, along with other improvements. Stay tuned!
            </Text>
            <Text>
                In the meanwhile, you can have a look at the
                {' '}
                <a href="https://corea.streamr.network/marketplace" target="_blank" rel="nofollow noopener noreferrer">
                    previous-milestone Marketplace
                </a>.
            </Text>
        </p>
    </EmptyState>
)

const ComingSoon = () => (
    <Layout
        framedClassname={styles.layoutFramed}
        innerClassname={styles.layoutInner}
        footer={false}
    >
        <MarketplaceHelmet />
        <Info />
        <Footer topBorder />
    </Layout>
)

export default ComingSoon
