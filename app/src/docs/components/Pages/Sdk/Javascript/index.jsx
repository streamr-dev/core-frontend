// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import JavascriptSdkContent from '$docs/content/sdk/javascript.mdx'

const JavascriptSdk = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="JavaScript SDK" />
        <section>
            <section id="javascript-sdk">
                <JavascriptSdkContent />
            </section>
        </section>
    </DocsLayout>
)

export default JavascriptSdk
