// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import TutorialsContent from '$docs/content/tutorials.mdx'

const subNav = {
    'weather-station': 'Weather Station with Ruuvi Sensors',
    'cold-chain-monitoring': 'Cold Chain Monitoring',
    'integrating-google-fitness': 'Integrating Google Fitness',
}

const TutorialsPage = () => (
    <DocsLayout subNav={subNav}>
        <Helmet>
            <title>Tutorials - Streamr Docs</title>
        </Helmet>
        <TutorialsContent />
    </DocsLayout>
)

export default TutorialsPage
