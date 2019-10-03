// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesAdvancedContent from '$docs/content/canvases/modulesAdvanced.mdx'

const ModulesAdvanced = () => (
    <DocsLayout>
        <Helmet title="Modules advanced | Streamr Docs" />
        <section>
            <ModulesAdvancedContent />
        </section>
    </DocsLayout>
)

export default ModulesAdvanced
