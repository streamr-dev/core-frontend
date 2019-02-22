// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import IntroductionPageContent from './Content.mdx'

const IntroductionPage = () => (
    <DocsLayout>
        <Helmet>
            <title>Introduction - Streamr Docs</title>
        </Helmet>
        <IntroductionPageContent />
    </DocsLayout>
)

export default IntroductionPage
