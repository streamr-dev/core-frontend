// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import GettingStartedIntro from '$docs/content/gettingStarted/intro.mdx'
import GetYourApiKeys from '$docs/content/gettingStarted/getYourApiKeys.mdx'
import ConnectEthereumIdentity from '$docs/content/gettingStarted/connectEthereumIdentity.mdx'
import GetBuilding from '$docs/content/gettingStarted/getBuilding.mdx'
import UsefulLinks from '$docs/content/gettingStarted/usefulLinks.mdx'

const GettingStarted = () => (
    <DocsLayout subNav={subNav.gettingStarted}>
        <Helmet title="Getting Started | Streamr Docs" />
        <section>
            <GettingStartedIntro />
        </section>
        <section id="get-api-keys">
            <GetYourApiKeys />
        </section>
        <section id="connecting-ethereum-identity">
            <ConnectEthereumIdentity />
        </section>
        <section id="get-building">
            <GetBuilding />
        </section>
        <section id="useful-links">
            <UsefulLinks />
        </section>
    </DocsLayout>
)

export default GettingStarted
