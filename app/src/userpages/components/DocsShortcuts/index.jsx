// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        <Link to={routes.docsIntroduction()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.introduction" />
        </Link>
        <Link to={routes.docsGettingStarted()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.gettingStarted" />
        </Link>
        <Link to={routes.docsVisualEditor()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.editor" />
        </Link>
        <Link to={routes.docsStreamrEngine()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.engine" />
        </Link>
        <Link to={routes.docsDataMarketplace()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.marketplace" />
        </Link>
        <Link to={routes.docsApi()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.streamrApi" />
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
