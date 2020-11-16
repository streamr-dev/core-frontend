// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesBasicsContent from '$docs/content/canvases/modulesBasics.mdx'

const ModulesBasics = () => (
    <DocsLayout>
        <DocsHelmet title="Modules basic" />
        <section>
            <ModulesBasicsContent />
        </section>
    </DocsLayout>
)

export default ModulesBasics
