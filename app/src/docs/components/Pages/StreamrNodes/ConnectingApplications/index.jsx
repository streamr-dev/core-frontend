// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ConnectingApplicationsContent from '$docs/content/streamrNodes/connectingApplications.mdx'

const ConnectingApplications = () => (
    <DocsLayout>
        <DocsHelmet title="Connecting applications to a Broker node" />
        <section>
            <ConnectingApplicationsContent />
        </section>
    </DocsLayout>
)

export default ConnectingApplications
