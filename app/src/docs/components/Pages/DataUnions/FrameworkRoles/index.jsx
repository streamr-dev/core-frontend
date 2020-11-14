// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import FrameworkRolesContent from '$docs/content/dataUnions/frameworkRoles.mdx'

const FrameworkRoles = () => (
    <DocsLayout>
        <DocsHelmet title="Data Unions Framework Roles" />
        <section>
            <FrameworkRolesContent />
        </section>
    </DocsLayout>
)

export default FrameworkRoles
