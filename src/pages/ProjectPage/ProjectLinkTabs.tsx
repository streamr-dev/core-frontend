import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import isPreventable from '~/utils/isPreventable'
import Tabs, { Tab } from '~/shared/components/Tabs'
import routes from '~/routes'

export default function ProjectLinkTabs({
    projectId,
    disabled = false,
}: {
    projectId?: string
    disabled?: boolean
}) {
    const { pathname } = useLocation()

    if (!projectId || disabled) {
        return (
            <Tabs>
                <Tab
                    id="overview"
                    tag={Link}
                    selected
                    to={pathname}
                    onClick={(e: unknown) => {
                        if (isPreventable(e)) {
                            e.preventDefault()
                        }
                    }}
                >
                    Project overview
                </Tab>
                <Tab id="connect" disabled>
                    Connect
                </Tab>
                <Tab id="liveData" disabled>
                    Live data
                </Tab>
            </Tabs>
        )
    }

    return (
        <Tabs selection={pathname}>
            <Tab
                id="overview"
                tag={Link}
                to={routes.projects.overview({ id: projectId })}
                selected="to"
            >
                Project overview
            </Tab>
            <Tab
                id="connect"
                tag={Link}
                to={routes.projects.connect({ id: projectId })}
                selected="to"
            >
                Connect
            </Tab>
            <Tab
                id="liveData"
                tag={Link}
                to={routes.projects.liveData({ id: projectId })}
                selected="to"
            >
                Live data
            </Tab>
        </Tabs>
    )
}
