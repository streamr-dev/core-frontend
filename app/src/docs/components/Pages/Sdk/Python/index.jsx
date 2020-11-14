// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import PythonSdkContent from '$docs/content/sdk/python.mdx'

const PythonSdk = () => (
    <DocsLayout>
        <DocsHelmet title="Python SDK" />
        <section>
            <section id="python-sdk">
                <PythonSdkContent />
            </section>
        </section>
    </DocsLayout>
)

export default PythonSdk
