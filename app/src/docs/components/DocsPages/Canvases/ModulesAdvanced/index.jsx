// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesAdvancedContent from '$docs/content/canvases/modulesAdvanced.mdx'

const ModulesAdvanced = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Modules advanced" />
        <section>
            <ModulesAdvancedContent />
        </section>
    </DocsLayout>
)

export default ModulesAdvanced
