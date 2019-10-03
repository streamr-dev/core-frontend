// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ModulesBasicsContent from '$docs/content/canvases/modulesBasics.mdx'

const ModulesBasics = () => (
    <DocsLayout>
        <Helmet title="Modules basic | Streamr Docs" />
        <section>
            <ModulesBasicsContent />
        </section>
    </DocsLayout>
)

export default ModulesBasics
