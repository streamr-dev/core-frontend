// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import AuthAndIdentityContent from '$docs/content/dataUnions/authAndIdentity.mdx'

const AuthAndIdentity = () => (
    <DocsLayout>
        <DocsHelmet title="Data Unions Authentication and Identity" />
        <section>
            <AuthAndIdentityContent />
        </section>
    </DocsLayout>
)

export default AuthAndIdentity
