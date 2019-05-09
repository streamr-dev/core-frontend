// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import links from '$app/src/links'
import navigationLinks from '$docs/components/DocsLayout/Navigation/navLinks'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        {Object.keys(navigationLinks).map((key) => (
            <Link key={key} to={navigationLinks[key]} target="_blank" rel="noopener noreferrer">
                {key}
            </Link>
        ))}
        {null}
        <Link href={links.community.telegram} target="_blank" rel="noopener noreferrer">Telegram Group</Link>
    </Onboarding>
)

export default DocsShortcuts
