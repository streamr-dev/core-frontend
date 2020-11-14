// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import AuthenticationContent from '$docs/content/api/authentication.mdx'

const Authentication = () => (
    <DocsLayout>
        <DocsHelmet title="Authentication" />
        <section>
            <AuthenticationContent />
        </section>
    </DocsLayout>
)

export default Authentication
