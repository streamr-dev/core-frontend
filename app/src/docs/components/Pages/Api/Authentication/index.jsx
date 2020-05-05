// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import AuthenticationContent from '$docs/content/api/authentication.mdx'

const Authentication = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Authentication" />
        <section>
            <AuthenticationContent />
        </section>
    </DocsLayout>
)

export default Authentication
