// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import routes from '$routes'
import navigationLinks from '$docs/components/DocsLayout/Navigation/navLinks'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        {Object.keys(navigationLinks).map((key) => (
            <Link key={key} to={navigationLinks[key]} target="_blank" rel="noopener noreferrer">
                {key}
            </Link>
        ))}
        {null}
        <Link href={routes.communityTelegram()} target="_blank" rel="noopener noreferrer">Telegram Group</Link>
        <Link href={routes.giveFeedback()} target="_blank" rel="noopener noreferrer">Give feedback</Link>
    </Onboarding>
)

export default DocsShortcuts
