// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToStreamrNetworkContent from '$docs/content/streamrNetwork/introToStreamrNetwork.mdx'

const IntroToStreamrNetwork = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to Streamr Network" />
        <section>
            <IntroToStreamrNetworkContent />
        </section>
    </DocsLayout>
)

export default IntroToStreamrNetwork
