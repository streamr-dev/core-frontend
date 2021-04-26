// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        <Link to={docsLinks.gettingStarted} target="_blank" rel="noopener noreferrer">
            Getting started
        </Link>
        <Link to={docsLinks.streams} target="_blank" rel="noopener noreferrer">
            Streams
        </Link>
        <Link to={docsLinks.products} target="_blank" rel="noopener noreferrer">
            Products
        </Link>
        <Link to={docsLinks.dataUnions} target="_blank" rel="noopener noreferrer">
            Data Unions
        </Link>
        {null}
        <Link href={routes.community.discord()} target="_blank" rel="noopener noreferrer">
            Discord
        </Link>
        <Link href={routes.giveFeedback()} target="_blank" rel="noopener noreferrer">
            Give feedback
        </Link>
    </Onboarding>
)

export default DocsShortcuts
