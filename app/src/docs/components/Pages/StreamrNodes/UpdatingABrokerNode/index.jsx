// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UpdatingABrokerNodeContent from '$docs/content/streamrNodes/updatingABrokerNode.mdx'

const UpdatingABrokerNode = () => (
    <DocsLayout>
        <DocsHelmet title="Updating a Broker node" />
        <section>
            <UpdatingABrokerNodeContent />
        </section>
    </DocsLayout>
)

export default UpdatingABrokerNode
