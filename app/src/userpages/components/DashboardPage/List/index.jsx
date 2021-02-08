// @flow

import React, { Fragment, useState, useMemo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import styled from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
import type { Dashboard, DashboardId } from '$userpages/flowtype/dashboard-types'
import { getDashboards, deleteOrRemoveDashboard } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import Layout from '$userpages/components/Layout'
import { getFilters } from '$userpages/utils/constants'
import confirmDialog from '$shared/utils/confirm'
import Search from '$userpages/components/Header/Search'
import Popover from '$shared/components/Popover'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'
import { DashboardTile } from '$shared/components/Tile'
import { getResourcePermissions, resetResourcePermission } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectDashboardPermissions } from '$userpages/modules/permission/selectors'
import Grid from '$shared/components/Tile/Grid'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { MD, LG } from '$shared/utils/styled'
import resourceUrl from '$shared/utils/resourceUrl'
import routes from '$routes'

import NoDashboardsView from './NoDashboards'

const DesktopOnlyButton = styled(Button)`
     && {
         display: none;
     }

     @media (min-width: ${LG}px) {
         && {
             display: inline-flex;
         }
     }
`

const StyledListContainer = styled(ListContainer)`
    && {
        margin-top: 16px;
    }

    @media (min-width: ${MD}px) {
        && {
            margin-top: 34px;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-top: 0;
        }
    }
`

function DashboardPageSidebar({ dashboard }) {
    const sidebar = useSidebar()
    const dispatch = useDispatch()

    const dashboardId = dashboard && dashboard.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (dashboardId) {
            dispatch(resetResourcePermission('DASHBOARD', dashboardId))
        }
    }, [sidebar, dispatch, dashboardId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    resourceTitle={dashboard && dashboard.name}
                    resourceType="DASHBOARD"
                    resourceId={dashboard && dashboard.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const CreateDashboardButton = () => (
    <DesktopOnlyButton
        tag={Link}
        to={routes.dashboards.edit({
            id: null,
        })}
    >
        <Translate value="userpages.dashboards.createDashboard" />
    </DesktopOnlyButton>
)

type RemoveOrDelete = 'remove' | 'delete'

const DashboardList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('dashboard')
        return [
            filters.RECENT_DESC,
            filters.NAME_ASC,
            filters.NAME_DESC,
        ]
    }, [])
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)

    const dashboards = useSelector(selectDashboards)
    const fetching = useSelector(selectFetching)
    const { copy } = useCopy()
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectDashboardPermissions)

    const sidebar = useSidebar()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDashboards(filter))
    }, [dispatch, filter])

    const deleteDashboardAndNotify = useCallback(async (id: DashboardId, type: RemoveOrDelete) => {
        try {
            await dispatch(deleteOrRemoveDashboard(id, type))

            Notification.push({
                title: I18n.t(`userpages.dashboards.${type}.notification`),
                icon: NotificationIcon.CHECKMARK,
            })
        } catch (e) {
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        }
    }, [dispatch])

    const confirmDeleteOrRemoveDashboard = useCallback(async (id: DashboardId, type: RemoveOrDelete) => {
        const confirmed = await confirmDialog('dashboard', {
            title: I18n.t(`userpages.dashboards.${type}.confirmTitle`),
            message: I18n.t(`userpages.dashboards.${type}.confirmMessage`),
            acceptButton: {
                title: I18n.t(`userpages.dashboards.${type}.confirmButton`),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            deleteDashboardAndNotify(id, type)
        }
    }, [deleteDashboardAndNotify])

    const [shareDialogDashboard, setShareDialogDashboard] = useState(undefined)
    const onOpenShareDialog = useCallback((dashboard: Dashboard) => {
        setShareDialogDashboard(dashboard)
        sidebar.open('share')
    }, [sidebar])

    const onCopyUrl = useCallback((id: DashboardId) => {
        copy(resourceUrl('DASHBOARD', id))

        Notification.push({
            title: I18n.t('userpages.dashboards.menu.copyUrlNotification'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const onToggleDashboardDropdown = useCallback((id: string) => async (open: boolean) => {
        if (open && !fetchingPermissions && !permissions[id]) {
            try {
                await dispatch(getResourcePermissions('DASHBOARD', id))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions])

    const canBeSharedByCurrentUser = useCallback((id: string): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('dashboard_share')
    ), [fetchingPermissions, permissions])

    const canBeDeletedByCurrentUser = useCallback((id: string): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('dashboard_delete')
    ), [fetchingPermissions, permissions])

    const navigate = useCallback((to) => dispatch(push(to)), [dispatch])

    const getActions = useCallback((dashboard) => {
        const removeType = canBeDeletedByCurrentUser(dashboard.id) ? 'delete' : 'remove'

        return (
            <Fragment>
                <Popover.Item
                    onClick={() => navigate(routes.dashboards.edit({
                        id: dashboard.id,
                    }))}
                >
                    <Translate value="userpages.dashboards.menu.edit" />
                </Popover.Item>
                <Popover.Item
                    disabled={!canBeSharedByCurrentUser(dashboard.id)}
                    onClick={() => onOpenShareDialog(dashboard)}
                >
                    <Translate value="userpages.dashboards.menu.share" />
                </Popover.Item>
                <Popover.Item
                    onClick={() => onCopyUrl(dashboard.id)}
                >
                    <Translate value="userpages.dashboards.menu.copyUrl" />
                </Popover.Item>
                <Popover.Item
                    onClick={() => confirmDeleteOrRemoveDashboard(dashboard.id, removeType)}
                >
                    <Translate value={`userpages.dashboards.menu.${removeType}`} />
                </Popover.Item>
            </Fragment>
        )
    }, [
        navigate,
        canBeSharedByCurrentUser,
        canBeDeletedByCurrentUser,
        onOpenShareDialog,
        onCopyUrl,
        confirmDeleteOrRemoveDashboard,
    ])

    return (
        <Layout
            headerAdditionalComponent={<CreateDashboardButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder={I18n.t('userpages.dashboards.filterDashboards')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Popover
                    title={I18n.t('userpages.filter.sortBy')}
                    type="uppercase"
                    caret="svg"
                    menuProps={{
                        right: true,
                    }}
                    activeTitle
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {sortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </Popover>
            }
            loading={fetching}
        >
            <CoreHelmet title={I18n.t('userpages.title.dashboards')} />
            <StyledListContainer>
                {!fetching && dashboards && dashboards.length <= 0 && (
                    <NoDashboardsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {dashboards && dashboards.length > 0 && (
                    <Grid>
                        {dashboards.map((dashboard) => (
                            <DashboardTile
                                key={dashboard.id}
                                dashboard={dashboard}
                                actions={getActions(dashboard)}
                                onMenuToggle={onToggleDashboardDropdown(dashboard.id)}
                            />
                        ))}
                    </Grid>
                )}
            </StyledListContainer>
            <DashboardPageSidebar dashboard={shareDialogDashboard} />
            <DocsShortcuts />
        </Layout>
    )
}

export default (props: any) => (
    <SidebarProvider>
        <DashboardList {...props} />
    </SidebarProvider>
)
