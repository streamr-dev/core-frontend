// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import EndtoEndEncryptionContent from '$docs/content/streams/endToEndEncryption.mdx'

const EndtoEndEncryption = () => (
    <DocsLayout>
        <DocsHelmet title="End to end encryption" />
        <section>
            <EndtoEndEncryptionContent />
        </section>
    </DocsLayout>
)

export default EndtoEndEncryption
