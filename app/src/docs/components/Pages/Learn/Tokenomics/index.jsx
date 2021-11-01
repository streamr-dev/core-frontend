// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import TokenomicsContent from '$docs/content/learn/tokenomics.mdx'

const Tokenomics = () => (
    <DocsLayout>
        <DocsHelmet title="Tokenomics" />
        <section>
            <TokenomicsContent />
        </section>
    </DocsLayout>
)

export default Tokenomics
