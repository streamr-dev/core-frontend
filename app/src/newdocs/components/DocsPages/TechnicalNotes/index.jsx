// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
// eslint-disable-next-line import/no-unresolved
import TechnicalNotesContent from '$newdocs/content/technical.mdx'

const TechnicalNotes = () => (
    <DocsLayout subNav={subNav.technicalNotes}>
        <Helmet title="Technical Notes | Streamr Docs" />
        <TechnicalNotesContent />
    </DocsLayout>
)

export default TechnicalNotes
