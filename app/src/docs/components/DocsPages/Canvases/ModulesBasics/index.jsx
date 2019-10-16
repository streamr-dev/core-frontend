// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesBasicsContent from '$docs/content/canvases/modulesBasics.mdx'

const ModulesBasics = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Modules basic" />
        <section>
            <ModulesBasicsContent />
        </section>
    </DocsLayout>
)

export default ModulesBasics
