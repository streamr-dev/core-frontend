// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IdentityContent from '$docs/content/learn/identity.mdx'

const Identity = () => (
    <DocsLayout>
        <DocsHelmet title="Identity" />
        <section>
            <IdentityContent />
        </section>
    </DocsLayout>
)

export default Identity
