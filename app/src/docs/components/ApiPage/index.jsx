// @flow

import React from 'react'

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
        <ApiPageContent />
    </DocsLayout>
)

export default ApiPage
