// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import EndtoEndEncryptionContent from '$docs/content/streams/endToEndEncryption.mdx'

const EndtoEndEncryption = () => (
    <DocsLayout>
        <Helmet title="End to end encryption | Streamr Docs" />
        <section>
            <EndtoEndEncryptionContent />
        </section>
    </DocsLayout>
)

export default EndtoEndEncryption
