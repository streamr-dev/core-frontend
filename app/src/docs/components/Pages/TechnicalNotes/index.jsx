// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import TechnicalNotesContent from '$docs/content/technicalNotes/technicalNotes.mdx'

const TechnicalNotes = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Technical Notes" />
        <section id="technical-notes">
            <TechnicalNotesContent />
        </section>
    </DocsLayout>
)

export default TechnicalNotes
