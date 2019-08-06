// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import IntroductionContent from '$docs/content/introduction.mdx'

const IntroductionPage = () => (
    <DocsLayout>
        <Helmet>
            <title>Streamr Docs | Introduction</title>
        </Helmet>
        <IntroductionContent />
    </DocsLayout>
)

export default IntroductionPage
