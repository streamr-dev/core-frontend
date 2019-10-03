// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataSigningAndVerificationContent from '$docs/content/streams/dataSigningAndVerification.mdx'

const DataSigningAndVerification = () => (
    <DocsLayout >
        <Helmet title="Data signing and verification | Streamr Docs" />
        <section id="data-signing-and-verification">
            <DataSigningAndVerificationContent />
        </section>
    </DocsLayout>
)

export default DataSigningAndVerification
