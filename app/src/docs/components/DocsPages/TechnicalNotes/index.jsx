// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import HowToContribute from '$docs/content/technicalNotes/howToContribute.mdx'
import RunningPrivateStreamrStack from '$docs/content/technicalNotes/runningPrivateStreamrStack.mdx'
import StreamrProtocolSpec from '$docs/content/technicalNotes/streamrProtocolSpec.mdx'

const TechnicalNotes = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Technical Notes" />
        <section id="how-to-contribute">
            <HowToContribute />
        </section>
        <section id="running-private-streamr-stack">
            <RunningPrivateStreamrStack />
        </section>
        <section id="streamr-protocol-spec">
            <StreamrProtocolSpec />
        </section>
    </DocsLayout>
)

export default TechnicalNotes
