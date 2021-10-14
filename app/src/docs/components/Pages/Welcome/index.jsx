// @flow

import React from 'react'
import DocsLayout from '$docs/components/DocsLayout'
import { DocsHelmet } from '$shared/components/Helmet'
import WelcomeContent from '$docs/content/welcome/welcome.mdx'

const Welcome = () => (
    <DocsLayout>
        <DocsHelmet title="Welcome" />
        <section>
            <WelcomeContent />
        </section>
    </DocsLayout>
)

export default Welcome
