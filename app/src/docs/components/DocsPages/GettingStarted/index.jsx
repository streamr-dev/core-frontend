// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import GettingStartedContent from '$docs/content/gettingStarted/gettingStarted.mdx'
import GetBuilding from '$docs/content/gettingStarted/getBuilding.mdx'

const GettingStarted = () => (
    <DocsLayout subNav={subNav.gettingStarted}>
        <Helmet title="Getting Started | Streamr Docs" />
        <section>
            <GettingStartedContent />
        </section>
        <section id="get-building">
            <GetBuilding />
        </section>
    </DocsLayout>
)

export default GettingStarted
