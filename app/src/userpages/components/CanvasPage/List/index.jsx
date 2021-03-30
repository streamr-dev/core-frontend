// @flow

import React, { Fragment, useEffect, useMemo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import type { Canvas, CanvasId } from '$userpages/flowtype/canvas-types'

import { CoreHelmet } from '$shared/components/Helmet'
import Layout from '$userpages/components/Layout'
import { getCanvases, deleteOrRemoveCanvas } from '$userpages/modules/canvas/actions'
import { selectCanvases, selectFetching } from '$userpages/modules/canvas/selectors'
import { getFilters } from '$userpages/utils/constants'
import Popover from '$shared/components/Popover'
import confirmDialog from '$shared/utils/confirm'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import { getResourcePermissions, resetResourcePermission } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectCanvasPermissions } from '$userpages/modules/permission/selectors'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'
import { CanvasTile } from '$shared/components/Tile'
import Grid from '$shared/components/Tile/Grid'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import resourceUrl from '$shared/utils/resourceUrl'
import { MD, LG } from '$shared/utils/styled'
import routes from '$routes'
import Search from '../../Header/Search'
import NoCanvasesView from './NoCanvases'

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

function CanvasPageSidebar({ canvas }) {
    const sidebar = useSidebar()
    const dispatch = useDispatch()

    const canvasId = canvas && canvas.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (canvasId) {
            dispatch(resetResourcePermission('CANVAS', canvasId))
        }
    }, [sidebar, dispatch, canvasId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    resourceTitle={canvas && canvas.name}
                    resourceType="CANVAS"
                    resourceId={canvas && canvas.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const CreateCanvasButton = () => (
    <DesktopOnlyButton
        tag={RouterLink}
        to={routes.canvases.edit({
            id: null,
        })}
    >
        Create canvas
    </DesktopOnlyButton>
)

const CanvasList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('canvas')
        return [
            filters.RECENT_DESC,
            filters.RUNNING,
            filters.STOPPED,
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

    const dispatch = useDispatch()
    const history = useHistory()
    const { copy } = useCopy()
    const canvases = useSelector(selectCanvases)
    const fetching = useSelector(selectFetching)
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectCanvasPermissions)

    const sidebar = useSidebar()

    useEffect(() => {
        dispatch(getCanvases(filter))
    }, [dispatch, filter])

    const deleteCanvasAndNotify = useCallback(async (id: CanvasId, hasDeletePermission: boolean) => {
        try {
            await dispatch(deleteOrRemoveCanvas(id))

            Notification.push({
                title: `Canvas ${hasDeletePermission ? 'deleted' : 'removed'} successfully`,
                icon: NotificationIcon.CHECKMARK,
            })
        } catch (e) {
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        }
    }, [dispatch])

    const confirmDeleteOrRemoveCanvas = useCallback(async (id: CanvasId, hasDeletePermission: boolean) => {
        const confirmed = await confirmDialog('canvas', {
            title: `${hasDeletePermission ? 'Delete' : 'Remove'} this canvas?`,
            message: 'This is an unrecoverable action. Please confirm this is what you want before you proceed.',
            acceptButton: {
                title: `Yes, ${hasDeletePermission ? 'delete' : 'remove'}`,
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            deleteCanvasAndNotify(id, hasDeletePermission)
        }
    }, [deleteCanvasAndNotify])

    const [shareDialogCanvas, setShareDialogCanvas] = useState(undefined)
    const onOpenShareDialog = useCallback((canvas: Canvas) => {
        setShareDialogCanvas(canvas)
        sidebar.open('share')
    }, [sidebar])

    const onCopyUrl = useCallback((id: CanvasId) => {
        copy(resourceUrl('CANVAS', id))

        Notification.push({
            title: 'Canvas URL copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const onToggleCanvasDropdown = useCallback((id: string) => async (open: boolean) => {
        if (open && !fetchingPermissions && !permissions[id]) {
            try {
                await dispatch(getResourcePermissions('CANVAS', id))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions])

    const canBeSharedByCurrentUser = useCallback((id: string): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('canvas_share')
    ), [fetchingPermissions, permissions])

    const canBeDeletedByCurrentUser = useCallback((id: string): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('canvas_delete')
    ), [fetchingPermissions, permissions])

    const navigate = useCallback((to) => history.push(to), [history])

    const getActions = useCallback((canvas) => {
        const hasDeletePermission = canBeDeletedByCurrentUser(canvas.id)

        return (
            <Fragment>
                <Popover.Item
                    onClick={() => navigate(routes.canvases.edit({
                        id: canvas.id,
                    }))}
                >
                    Edit
                </Popover.Item>
                <Popover.Item
                    disabled={!canBeSharedByCurrentUser(canvas.id)}
                    onClick={() => onOpenShareDialog(canvas)}
                >
                    Share
                </Popover.Item>
                <Popover.Item
                    onClick={() => onCopyUrl(canvas.id)}
                >
                    Copy URL
                </Popover.Item>
                <Popover.Item
                    onClick={() => confirmDeleteOrRemoveCanvas(canvas.id, hasDeletePermission)}
                >
                    {hasDeletePermission ? 'Delete' : 'Remove'}
                </Popover.Item>
            </Fragment>
        )
    }, [
        navigate,
        canBeSharedByCurrentUser,
        canBeDeletedByCurrentUser,
        onOpenShareDialog,
        onCopyUrl,
        confirmDeleteOrRemoveCanvas,
    ])

    return (
        <Layout
            headerAdditionalComponent={<CreateCanvasButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder="Filter canvases"
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Popover
                    title="Sort by"
                    type="uppercase"
                    caret="svg"
                    activeTitle
                    menuProps={{
                        right: true,
                    }}
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
            <StyledListContainer>
                <CoreHelmet title="Canvases" />
                {!fetching && canvases && !canvases.length && (
                    <NoCanvasesView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {canvases.length > 0 && (
                    <Grid>
                        {canvases.map((canvas) => (
                            <CanvasTile
                                actions={getActions(canvas)}
                                canvas={canvas}
                                key={canvas.id}
                                onMenuToggle={onToggleCanvasDropdown(canvas.id)}
                            />
                        ))}
                    </Grid>
                )}
            </StyledListContainer>
            <CanvasPageSidebar canvas={shareDialogCanvas} />
            <DocsShortcuts />
        </Layout>
    )
}

export default (props: any) => (
    <SidebarProvider>
        <CanvasList {...props} />
    </SidebarProvider>
)
