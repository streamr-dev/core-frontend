// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'
import TutorialsPageContent from './Content.mdx'

const subNav = {
    'weather-station': 'Weather Station with Ruuvi Sensors',
    'cold-chain-monitoring': 'Cold Chain Monitoring',
    'integrating-google-fitness': 'Integrating Google Fitness',
}

const TutorialsPage = () => (
    <DocsLayout subNav={subNav}>
        <TutorialsPageContent />
    </DocsLayout>
)

export default TutorialsPage
