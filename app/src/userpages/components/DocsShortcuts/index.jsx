// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        <Link to={routes.docsGettingStarted()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.gettingStarted" />
        </Link>
        <Link to={routes.docsStreams()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.streams" />
        </Link>
        <Link to={routes.docsCanvases()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.canvases" />
        </Link>
        <Link to={routes.docsDashboards()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.dashboards" />
        </Link>
        <Link to={routes.docsProducts()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.products" />
        </Link>
        {null}
        <Link href={routes.communityTelegram()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.telegramGroup" />
        </Link>
        <Link href={routes.giveFeedback()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.giveFeedback" />
        </Link>
    </Onboarding>
)

export default DocsShortcuts
