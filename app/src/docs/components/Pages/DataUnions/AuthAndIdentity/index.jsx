// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import AuthAndIdentityContent from '$docs/content/dataUnions/authAndIdentity.mdx'

const AuthAndIdentity = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions Authentication and Identity" />
        <section>
            <AuthAndIdentityContent />
        </section>
    </DocsLayout>
)

export default AuthAndIdentity
