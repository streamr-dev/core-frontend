// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import ApiPageContent from './Content.mdx'

const subNav = {
    'introduction-to-streamr-apis': 'Introduction to Streamr APIs',
    authentication: 'Authentication',
    'data-input': 'Data Input',
    'data-output': 'Data Output',
    'api-explorer': 'API Explorer',
}

const ApiPage = () => (
    <DocsLayout subNav={subNav}>
        <Helmet>
            <title>Streamr API - Streamr Docs</title>
        </Helmet>
        <ApiPageContent />
    </DocsLayout>
)

export default ApiPage
