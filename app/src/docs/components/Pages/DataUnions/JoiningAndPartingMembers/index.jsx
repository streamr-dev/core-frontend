// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import JoiningAndPartingMembersContent from '$docs/content/dataUnions/joiningAndPartingMembers.mdx'

const JoiningAndPartingMembers = () => (
    <DocsLayout>
        <DocsHelmet title="Joining and parting members" />
        <section>
            <JoiningAndPartingMembersContent />
        </section>
    </DocsLayout>
)

export default JoiningAndPartingMembers
