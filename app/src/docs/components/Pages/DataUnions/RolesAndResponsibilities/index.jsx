// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import RolesAndResponsibilitiesContent from '$docs/content/dataUnions/rolesAndResponsibilities.mdx'

const RolesAndResponsibilities = () => (
    <DocsLayout>
        <DocsHelmet title="Roles and responsibilities" />
        <section>
            <RolesAndResponsibilitiesContent />
        </section>
    </DocsLayout>
)

export default RolesAndResponsibilities
