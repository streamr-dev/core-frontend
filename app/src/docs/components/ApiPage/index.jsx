// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'
// $FlowFixMe
import ApiPageContent from './Content.mdx'

const subNav = {
    clientLibraries: 'Client Libraries',
    authentication: 'Authentication',
}

const ApiPage = () => (
    <DocsLayout subNav={subNav}>
        <ApiPageContent />
    </DocsLayout>
)

export default ApiPage
