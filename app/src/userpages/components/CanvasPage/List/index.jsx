// @flow

import React, { Fragment, useEffect, useMemo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { push } from 'connected-react-router'
import { Translate, I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'

import type { Canvas } from '$userpages/flowtype/canvas-types'

import Layout from '$userpages/components/Layout'
import { getCanvases, deleteCanvas } from '$userpages/modules/canvas/actions'
import { selectCanvases, selectFetching } from '$userpages/modules/canvas/selectors'
import { getFilters } from '$userpages/utils/constants'
import DropdownActions from '$shared/components/DropdownActions'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import ShareDialog from '$userpages/components/ShareDialog'
import confirmDialog from '$shared/utils/confirm'
import { selectUserData } from '$shared/modules/user/selectors'
import NoCanvasesView from './NoCanvases'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectCanvasPermissions } from '$userpages/modules/permission/selectors'
import type { Permission } from '$userpages/flowtype/permission-types'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'
import styles from './canvasList.pcss'
import { CanvasTile } from '$shared/components/Tile'
import Grid from '$shared/components/Tile/Grid'
import routes from '$routes'

const CreateCanvasButton = () => (
    <Button
        className={styles.createCanvasButton}
        tag={RouterLink}
        to={routes.canvases.edit({
            id: null,
        })}
    >
        <Translate value="userpages.canvases.createCanvas" />
    </Button>
)

const CanvasList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.RECENT,
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
    const { copy } = useCopy()
    const user = useSelector(selectUserData)
    const canvases = useSelector(selectCanvases)
    const fetching = useSelector(selectFetching)
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectCanvasPermissions)

    useEffect(() => {
        dispatch(getCanvases(filter))
    }, [dispatch, filter])

    const confirmDeleteCanvas = useCallback(async (canvas: Canvas) => {
        const confirmed = await confirmDialog('canvas', {
            title: I18n.t('userpages.canvases.delete.confirmTitle'),
            message: I18n.t('userpages.canvases.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.canvases.delete.confirmButton'),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            dispatch(deleteCanvas(canvas.id))
        }
    }, [dispatch])

    const [shareDialogCanvas, setShareDialogCanvas] = useState(undefined)
    const onOpenShareDialog = useCallback((canvas: Canvas) => {
        setShareDialogCanvas(canvas)
    }, [])

    const onCloseShareDialog = useCallback(() => {
        setShareDialogCanvas(undefined)
    }, [])

    const onCopyUrl = useCallback((url: string) => {
        copy(url)

        Notification.push({
            title: I18n.t('userpages.canvases.menu.copyUrlNotification'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const onToggleCanvasDropdown = useCallback((id: string) => async (open: boolean) => {
        if (open && !fetchingPermissions && !permissions[id]) {
            try {
                await dispatch(getResourcePermissions('CANVAS', id, false))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions])

    const canBeSharedByCurrentUser = useCallback((id: string): boolean => (
        !fetchingPermissions &&
        !!user &&
        permissions[id] &&
        permissions[id].find((p: Permission) => p.user === user.username && p.operation === 'share') !== undefined
    ), [fetchingPermissions, permissions, user])

    const navigate = useCallback((to) => dispatch(push(to)), [dispatch])

    const getActions = useCallback((canvas) => (
        <Fragment>
            <DropdownActions.Item
                onClick={() => navigate(routes.canvases.edit({
                    id: canvas.id,
                }))}
            >
                <Translate value="userpages.canvases.menu.edit" />
            </DropdownActions.Item>
            <DropdownActions.Item
                disabled={!canBeSharedByCurrentUser(canvas.id)}
                onClick={() => onOpenShareDialog(canvas)}
            >
                <Translate value="userpages.canvases.menu.share" />
            </DropdownActions.Item>
            <DropdownActions.Item
                onClick={() => onCopyUrl(routes.canvases.public.edit({
                    id: canvas.id,
                }))}
            >
                <Translate value="userpages.canvases.menu.copyUrl" />
            </DropdownActions.Item>
            <DropdownActions.Item
                onClick={() => confirmDeleteCanvas(canvas)}
            >
                <Translate value="userpages.canvases.menu.delete" />
            </DropdownActions.Item>
        </Fragment>
    ), [navigate, canBeSharedByCurrentUser, onOpenShareDialog, onCopyUrl, confirmDeleteCanvas])

    return (
        <Layout
            headerAdditionalComponent={<CreateCanvasButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.canvases.filterCanvases')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {sortOptions.map((s) => (
                        <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            }
            loading={fetching}
        >
            {!!shareDialogCanvas && (
                <ShareDialog
                    resourceTitle={shareDialogCanvas.name}
                    resourceType="CANVAS"
                    resourceId={shareDialogCanvas.id}
                    onClose={onCloseShareDialog}
                    allowEmbed
                />
            )}
            <ListContainer className={styles.corepageContentContainer}>
                <Helmet title={`Streamr Core | ${I18n.t('userpages.canvases.title')}`} />
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
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default CanvasList
