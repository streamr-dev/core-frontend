// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDataUnionsContent from '$docs/content/dataUnions/introToDataUnions.mdx'

const IntroToDataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to Data Unions" />
        <section>
            <IntroToDataUnionsContent />
        </section>
    </DocsLayout>
)

export default IntroToDataUnions
