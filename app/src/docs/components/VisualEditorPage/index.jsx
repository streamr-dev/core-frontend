// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import VisualEditorContent from '$docs/content/visualEditor.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const VisualEditorPage = () => (
    <DocsLayout subNav={subNav.visualEditor}>
        <Helmet>
            <title>Visual Editor- Streamr Docs</title>
        </Helmet>
        <VisualEditorContent />
    </DocsLayout>
)

export default VisualEditorPage
