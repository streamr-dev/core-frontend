// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataSigningAndVerificationContent from '$docs/content/streams/dataSigningAndVerification.mdx'

const DataSigningAndVerification = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Data signing and verification" />
        <section id="data-signing-and-verification">
            <DataSigningAndVerificationContent />
        </section>
    </DocsLayout>
)

export default DataSigningAndVerification
