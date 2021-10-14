// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import InstallingABrokerNodeContent from '$docs/content/streamrNetwork/installingABrokerNode.mdx'

const InstallingABrokerNode = () => (
    <DocsLayout>
        <DocsHelmet title="Installing a Broker node" />
        <section>
            <InstallingABrokerNodeContent />
        </section>
    </DocsLayout>
)

export default InstallingABrokerNode
