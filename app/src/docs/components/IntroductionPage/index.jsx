// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import IntroductionContent from '$docs/content/introduction.mdx'

const IntroductionPage = () => (
    <DocsLayout>
        <Helmet>
            <title>Introduction - Streamr Docs</title>
        </Helmet>
        <IntroductionContent />
    </DocsLayout>
)

export default IntroductionPage
