// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import BuildingCustomModuleContent from '$docs/content/tutorials/buildingCustomModule.mdx'

const BuildingCustomModule = () => (
    <DocsLayout>
        <DocsHelmet title="Building custom canvas module" />
        <section>
            <BuildingCustomModuleContent />
        </section>
    </DocsLayout>
)

export default BuildingCustomModule
