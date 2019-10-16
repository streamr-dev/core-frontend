// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import GettingStartedContent from '$docs/content/gettingStarted/gettingStarted.mdx'
import GetBuilding from '$docs/content/gettingStarted/getBuilding.mdx'

const GettingStarted = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Getting Started" />
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
