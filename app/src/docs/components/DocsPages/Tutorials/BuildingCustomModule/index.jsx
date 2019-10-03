// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import BuildingCustomModuleContent from '$docs/content/tutorials/buildingCustomModule.mdx'

const BuildingCustomModule = () => (
    <DocsLayout>
        <Helmet title="Building custom canvas module | Streamr Docs" />
        <section>
            <BuildingCustomModuleContent />
        </section>
    </DocsLayout>
)

export default BuildingCustomModule
