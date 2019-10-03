// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '$docs/components/DocsLayout'
import IntroductionContent from '$docs/content/introduction/introduction.mdx'

const Introduction = () => (
    <DocsLayout>
        <Helmet title="Introduction | Streamr Docs" />
        <section className="introductionPage"> {/* temporary section during design style pass */}
            <IntroductionContent />
        </section>
    </DocsLayout>
)

export default Introduction
