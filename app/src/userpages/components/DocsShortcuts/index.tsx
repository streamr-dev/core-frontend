import React, { FunctionComponent } from 'react'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import routes from '$routes'

const DocsShortcuts: FunctionComponent = () => (
    <Onboarding title="Docs">
        <Link href="https://docs.streamr.network/quickstart" target="_blank" rel="noopener noreferrer">
            Quickstart
        </Link>
        <Link href="https://docs.streamr.network/usage" target="_blank" rel="noopener noreferrer">
            Usage
        </Link>
        <Link href="https://docs.streamr.network/streamr-network" target="_blank" rel="noopener noreferrer">
            Streamr Network
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
