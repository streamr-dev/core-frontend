// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToMarketplace from '$newdocs/content/marketplace/introToMarketplace.mdx'
import BuyingDataMarketplace from '$newdocs/content/marketplace/buyingDataMarketplace.mdx'
import SellingDataMarketplace from '$newdocs/content/marketplace/sellingDataMarketplace.mdx'

const Marketplace = () => (
    <DocsLayout subNav={subNav.marketplace}>
        <Helmet title="Marketplace | Streamr Docs" />
        <section id="introduction-marketplace">
            <IntroToMarketplace />
        </section>
        <section id="buying-data-marketplace">
            <BuyingDataMarketplace />
        </section>
        <section id="selling-data-marketplace">
            <SellingDataMarketplace />
        </section>
    </DocsLayout>
)

export default Marketplace
