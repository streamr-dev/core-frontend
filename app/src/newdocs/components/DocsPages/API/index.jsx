// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import ApiContent from '$newdocs/content/api.mdx'

const API = () => (
    <DocsLayout subNav={subNav.api}>
        <Helmet title="Streamr API | Streamr Docs" />
        <ApiContent />
    </DocsLayout>
)

export default API
