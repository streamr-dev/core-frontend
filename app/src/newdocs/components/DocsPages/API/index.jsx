// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import ApiOverview from '$newdocs/content/api/apiOverview.mdx'
import Authentication from '$newdocs/content/api/authentication.mdx'
import WorkWithStreamsViaApi from '$newdocs/content/streams/workWithStreamsViaApi.mdx'
import ApiExplorer from '$newdocs/content/api/apiExplorer.mdx'

const API = () => (
    <DocsLayout subNav={subNav.api}>
        <Helmet title="Streamr API | Streamr Docs" />
        <section id="api-overview">
            <ApiOverview />
        </section>
        <section id="authentication">
            <Authentication />
        </section>
        <section id="work-with-streams-via-api">
            <WorkWithStreamsViaApi />
        </section>
        <section id="api-explorer">
            <ApiExplorer />
        </section>
    </DocsLayout>
)

export default API
