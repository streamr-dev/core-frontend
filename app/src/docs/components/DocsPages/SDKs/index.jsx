// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import SdksOverview from '$docs/content/sdks/sdksOverview.mdx'
import JavascriptSdk from '$docs/content/sdks/javascriptSdk.mdx'
import JavaSdk from '$docs/content/sdks/javaSdk.mdx'
import PythonSdk from '$docs/content/sdks/pythonSdk.mdx'
import ContributeSdk from '$docs/content/technicalNotes/howToContribute.mdx'

const SDKs = () => (
    <DocsLayout subNav={subNav.SDKs}>
        <Helmet title="SDKs | Streamr Docs" />
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
    </DocsLayout>
)

export default SDKs
