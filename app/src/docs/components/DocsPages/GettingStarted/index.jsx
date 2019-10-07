// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import GettingStartedContent from '$docs/content/gettingStarted/gettingStarted.mdx'
import GetBuilding from '$docs/content/gettingStarted/getBuilding.mdx'

const GettingStarted = () => (
    <DocsLayout>
        <Helmet title="Getting Started | Streamr Docs" />
        <section>
            <section>
                <GettingStartedContent />
            </section>
            <section id="get-building">
                <GetBuilding />
            </section>
        </section>
    </DocsLayout>
)

export default GettingStarted
