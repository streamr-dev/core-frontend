// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDataUnionsContent from '$docs/content/dataUnions/introToDataUnions.mdx'

const IntroToDataUnions = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to Data Unions" />
        <section>
            <IntroToDataUnionsContent />
        </section>
    </DocsLayout>
)

export default IntroToDataUnions
