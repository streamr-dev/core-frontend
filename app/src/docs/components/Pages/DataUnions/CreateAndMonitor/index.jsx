// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreateAndMonitorContent from '$docs/content/dataUnions/createAndMonitor.mdx'

const CreateAndMonitor = () => (
    <DocsLayout>
        <DocsHelmet title="Create and monitor Data Unions" />
        <section>
            <CreateAndMonitorContent />
        </section>
    </DocsLayout>
)

export default CreateAndMonitor
