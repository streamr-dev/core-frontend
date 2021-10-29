// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import AccessControlContent from '$docs/content/streams/accessControl.mdx'

const AccessControl = () => (
    <DocsLayout>
        <DocsHelmet title="Access control" />
        <section>
            <AccessControlContent />
        </section>
    </DocsLayout>
)

export default AccessControl
