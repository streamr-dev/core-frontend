// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToStreams from '$docs/content/streams/introToStreams.mdx'
import WorkWithStreamsInCore from '$docs/content/streams/workWithStreamsInCore.mdx'
import WorkWithStreamsViaSdk from '$docs/content/streams/workWithStreamsViaSdk.mdx'
import WorkWithStreamsViaApi from '$docs/content/streams/workWithStreamsViaApi.mdx'
import DataSigningAndVerification from '$docs/content/streams/dataSigningAndVerification.mdx'
import EndtoEndEncryption from '$docs/content/streams/endToEndEncryption.mdx'
import Partitioning from '$docs/content/streams/partitioning.mdx'
import IntegrationPatterns from '$docs/content/streams/integrationPatterns.mdx'

const Streams = () => (
    <DocsLayout subNav={subNav.streams}>
        <Helmet title="Streams | Streamr Docs" />
        <section id="intro-to-streams">
            <IntroToStreams />
        </section>
        <section id="work-with-streams-in-core">
            <WorkWithStreamsInCore />
        </section>
        <section id="work-with-streams-via-sdks">
            <WorkWithStreamsViaSdk />
        </section>
        <section id="work-with-streams-via-api">
            <WorkWithStreamsViaApi />
        </section>
        <section id="data-signing-and-verification">
            <DataSigningAndVerification />
        </section>
        <section id="end-to-end-encryption">
            <EndtoEndEncryption />
        </section>
        <section id="partitioning">
            <Partitioning />
        </section>
        <section id="integration-patterns">
            <IntegrationPatterns />
        </section>
    </DocsLayout>
)

export default Streams
