// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import HowToContribute from '$docs/content/technicalNotes/howToContribute.mdx'
import RunningPrivateStreamrStack from '$docs/content/technicalNotes/runningPrivateStreamrStack.mdx'
import StreamrProtocolSpec from '$docs/content/technicalNotes/streamrProtocolSpec.mdx'

const TechnicalNotes = () => (
    <DocsLayout subNav={subNav.technicalNotes}>
        <Helmet title="Technical Notes | Streamr Docs" />
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
