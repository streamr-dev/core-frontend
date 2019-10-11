// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsViaApiContent from '$docs/content/streams/usingStreamsViaApi.mdx'

const UsingStreamsViaApi = () => (
    <DocsLayout>
        <Helmet title="Work with streams via API | Streamr Docs" />
        <section>
            <UsingStreamsViaApiContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsViaApi
