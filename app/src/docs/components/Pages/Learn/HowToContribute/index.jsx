// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import HowToContributeContent from '$docs/content/learn/howToContribute.mdx'

const HowToContribute = () => (
    <DocsLayout>
        <DocsHelmet title="How To Contribute" />
        <section>
            <HowToContributeContent />
        </section>
    </DocsLayout>
)

export default HowToContribute
