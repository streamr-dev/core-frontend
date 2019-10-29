// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import SdksOverview from '$docs/content/sdks/sdksOverview.mdx'
import JavascriptSdk from '$docs/content/sdks/javascriptSdk.mdx'
import JavaSdk from '$docs/content/sdks/javaSdk.mdx'
import PythonSdk from '$docs/content/sdks/pythonSdk.mdx'
import ContributeSdk from '$docs/content/technicalNotes/howToContribute.mdx'

const SDKs = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="SDKs" />
        <section>
            <section id="sdks-overview">
                <SdksOverview />
            </section>
            <section id="javascript-sdk">
                <JavascriptSdk />
            </section>
            <section id="java-sdk">
                <JavaSdk />
            </section>
            <section id="python-sdk">
                <PythonSdk />
            </section>
            <section id="contribute-sdk">
                <ContributeSdk />
            </section>
        </section>
    </DocsLayout>
)

export default SDKs
