// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesAdvancedContent from '$docs/content/canvases/modulesAdvanced.mdx'

const ModulesAdvanced = () => (
    <DocsLayout>
        <DocsHelmet title="Modules advanced" />
        <section>
            <ModulesAdvancedContent />
        </section>
    </DocsLayout>
)

export default ModulesAdvanced
