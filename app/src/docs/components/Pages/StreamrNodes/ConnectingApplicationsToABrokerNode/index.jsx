// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ConnectingApplicationsToABrokerNodeContent from '$docs/content/streamrNodes/connectingApplicationsToABrokerNode.mdx'

const ConnectingApplicationsToABrokerNode = () => (
    <DocsLayout>
        <DocsHelmet title="Connecting applications to a Broker node" />
        <section>
            <ConnectingApplicationsToABrokerNodeContent />
        </section>
    </DocsLayout>
)

export default ConnectingApplicationsToABrokerNode
