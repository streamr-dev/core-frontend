// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import JavaSdkContent from '$docs/content/sdk/java.mdx'

const JavaSdk = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Java SDK" />
        <section>
            <section id="java-sdk">
                <JavaSdkContent />
            </section>
        </section>
    </DocsLayout>
)

export default JavaSdk
