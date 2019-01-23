// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'
// $FlowFixMe
import ApiPageContent from './Content.mdx'

const subNavigationItems = {
    clientLibraries: 'Client Libraries',
    authentication: 'Authentication',
}

const ApiPage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <ApiPageContent />
    </DocsLayout>
)

export default ApiPage
