// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import TutorialsPageContent from './Content.mdx'

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
        <TutorialsPageContent />
    </DocsLayout>
)

export default TutorialsPage
