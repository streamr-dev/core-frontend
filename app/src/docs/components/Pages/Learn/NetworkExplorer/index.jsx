// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import NetworkExplorerContent from '$docs/content/learn/networkExplorer.mdx'

const NetworkExplorer = () => (
    <DocsLayout>
        <DocsHelmet title="NetworkExplorer" />
        <section>
            <NetworkExplorerContent />
        </section>
    </DocsLayout>
)

export default NetworkExplorer
