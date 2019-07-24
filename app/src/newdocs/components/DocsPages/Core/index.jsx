// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import CoreContent from '$newdocs/content/core.mdx'

const Core = () => (
    <DocsLayout subNav={subNav.core}>
        <Helmet title="Core | Streamr Docs" />
        <CoreContent />
    </DocsLayout>
)

export default Core
