import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import isPreventable from '~/utils/isPreventable'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { Route as R, routeOptions } from '~/utils/routes'
import { useCurrentChainSymbolicName } from '~/utils/chains'

export default function ProjectLinkTabs({
    projectId,
    disabled = false,
}: {
    projectId?: string
    disabled?: boolean
}) {
    const { pathname } = useLocation()

    const chainName = useCurrentChainSymbolicName()

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
        <Tabs>
            <Tab
                id="overview"
                tag={Link}
                to={R.projectOverview(projectId, routeOptions(chainName))}
                selected={pathname.startsWith(R.projectOverview(projectId))}
            >
                Project overview
            </Tab>
            <Tab
                id="connect"
                tag={Link}
                to={R.projectConnect(projectId, routeOptions(chainName))}
                selected={pathname.startsWith(R.projectConnect(projectId))}
            >
                Connect
            </Tab>
            <Tab
                id="liveData"
                tag={Link}
                to={R.projectLiveData(projectId, routeOptions(chainName))}
                selected={pathname.startsWith(R.projectLiveData(projectId))}
            >
                Live data
            </Tab>
        </Tabs>
    )
}
