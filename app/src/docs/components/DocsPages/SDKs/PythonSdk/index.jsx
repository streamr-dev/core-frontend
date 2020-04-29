// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import PythonSdkContent from '$docs/content/sdks/pythonSdk.mdx'

const PythonSDK = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Python SDK" />
        <section>
            <section id="python-sdk">
                <PythonSdkContent />
            </section>
        </section>
    </DocsLayout>
)

export default PythonSDK
