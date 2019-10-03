// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import AuthenticationContent from '$docs/content/api/authentication.mdx'

const Authentication = () => (
    <DocsLayout>
        <Helmet title="Authentication | Streamr Docs" />
        <section>
            <AuthenticationContent />
        </section>
    </DocsLayout>
)

export default Authentication
