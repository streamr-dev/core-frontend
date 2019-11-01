// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { capital } from 'case'
import Link from '$shared/components/Link'
import { push } from 'connected-react-router'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import cx from 'classnames'

import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import type { Canvas } from '$userpages/flowtype/canvas-types'

import Layout from '$userpages/components/Layout'
import links from '$app/src/links'
import { getCanvases, deleteCanvas, updateFilter } from '$userpages/modules/canvas/actions'
import { selectCanvases, selectFilter, selectFetching } from '$userpages/modules/canvas/selectors'
import { getFilters } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import TileStyles from '$shared/components/Tile/tile.pcss'
import DropdownActions from '$shared/components/DropdownActions'
import { formatExternalUrl } from '$shared/utils/url'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import ShareDialog from '$userpages/components/ShareDialog'
import confirmDialog from '$shared/utils/confirm'
import type { User } from '$shared/flowtype/user-types'
import { selectUserData } from '$shared/modules/user/selectors'
import NoCanvasesView from './NoCanvases'
import { RunStates } from '$editor/canvas/state'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectCanvasPermissions } from '$userpages/modules/permission/selectors'
import type { Permission, ResourceId } from '$userpages/flowtype/permission-types'
import CanvasPreview from '$editor/canvas/components/Preview'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'

import styles from './canvasList.pcss'

export type StateProps = {
    user: ?User,
    canvases: Array<Canvas>,
    filter: ?Filter,
    fetching: boolean,
    fetchingPermissions: boolean,
    permissions: {
        [ResourceId]: Array<Permission>,
    },
}

export type DispatchProps = {
    getCanvases: () => void,
    deleteCanvas: (id: string) => void,
    updateFilter: (filter: Filter) => void,
    navigate: (to: string) => void,
    copyToClipboard: (text: string) => void,
    getCanvasPermissions: (id: string) => Promise<void>,
}

type Props = StateProps & DispatchProps

type State = {
    shareDialogCanvas: ?Canvas,
}

const CreateCanvasButton = () => (
    <Button
        color="primary"
        className={styles.createCanvasButton}
        tag={Link}
        to={links.editor.canvasEditor}
    >
        <Translate value="userpages.canvases.createCanvas" />
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.RECENT,
        filters.RUNNING,
        filters.STOPPED,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]
}

class CanvasList extends Component<Props, State> {
    defaultFilter = getSortOptions()[0].filter

    state = {
        shareDialogCanvas: undefined,
    }

    componentDidMount() {
        const { filter, updateFilter, getCanvases } = this.props

        // Set default filter if not selected
        if (!filter) {
            updateFilter(this.defaultFilter)
        }
        getCanvases()
    }

    confirmDeleteCanvas = async (canvas: Canvas) => {
        const confirmed = await confirmDialog('canvas', {
            title: I18n.t('userpages.canvases.delete.confirmTitle'),
            message: I18n.t('userpages.canvases.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.canvases.delete.confirmButton'),
                color: 'danger',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            this.props.deleteCanvas(canvas.id)
        }
    }

    onOpenShareDialog = (canvas: Canvas) => {
        this.setState({
            shareDialogCanvas: canvas,
        })
    }

    onCloseShareDialog = () => {
        this.setState({
            shareDialogCanvas: null,
        })
    }

    onCopyUrl = (url: string) => {
        this.props.copyToClipboard(url)

        Notification.push({
            title: I18n.t('userpages.canvases.menu.copyUrlNotification'),
            icon: NotificationIcon.CHECKMARK,
        })
    }

    getActions = (canvas) => {
        const { navigate } = this.props

        const editUrl = formatExternalUrl(
            process.env.PLATFORM_ORIGIN_URL,
            `${links.editor.canvasEditor}/${canvas.id}`,
        )

        return (
            <Fragment>
                <DropdownActions.Item onClick={() => navigate(`${links.editor.canvasEditor}/${canvas.id}`)}>
                    <Translate value="userpages.canvases.menu.edit" />
                </DropdownActions.Item>
                <DropdownActions.Item
                    disabled={!this.hasPermission(canvas.id, 'share')}
                    onClick={() => this.onOpenShareDialog(canvas)}
                >
                    <Translate value="userpages.canvases.menu.share" />
                </DropdownActions.Item>
                <DropdownActions.Item onClick={() => this.onCopyUrl(editUrl)}>
                    <Translate value="userpages.canvases.menu.copyUrl" />
                </DropdownActions.Item>
                <DropdownActions.Item
                    onClick={() => this.confirmDeleteCanvas(canvas)}
                >
                    <Translate value="userpages.canvases.menu.delete" />
                </DropdownActions.Item>
            </Fragment>
        )
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getCanvases } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getCanvases()
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter, getCanvases } = this.props
        const sortOption = getSortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                search: filter && filter.search,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
            getCanvases()
        }
    }

    resetFilter = () => {
        const { updateFilter, getCanvases } = this.props
        updateFilter({
            ...this.defaultFilter,
            search: '',
        })
        getCanvases()
    }

    generateTimeAgoDescription = (canvasUpdatedDate: Date) => moment(canvasUpdatedDate).fromNow()

    onToggleStreamDropdown = (id: string) => async (open: boolean) => {
        const { getCanvasPermissions, fetchingPermissions, permissions } = this.props

        if (open && !fetchingPermissions && !permissions[id]) {
            try {
                await getCanvasPermissions(id)
            } catch (e) {
                // Noop.
            }
        }
    }

    hasPermission = (id: string, operation: string): boolean => {
        const { fetchingPermissions, permissions, user } = this.props

        return (
            !fetchingPermissions &&
            !!user &&
            permissions[id] &&
            permissions[id].find((p: Permission) => p.user === user.username && p.operation === operation) !== undefined
        )
    }

    render() {
        const { canvases, filter, fetching } = this.props
        const { shareDialogCanvas } = this.state

        return (
            <Layout
                headerAdditionalComponent={<CreateCanvasButton />}
                headerSearchComponent={
                    <Search
                        placeholder={I18n.t('userpages.canvases.filterCanvases')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
                    />
                }
                headerFilterComponent={
                    <Dropdown
                        title={I18n.t('userpages.filter.sortBy')}
                        onChange={this.onSortChange}
                        selectedItem={(filter && filter.id) || this.defaultFilter.id}
                    >
                        {getSortOptions().map((s) => (
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
                        onClose={this.onCloseShareDialog}
                        allowEmbed
                    />
                )}
                <ListContainer className={styles.corepageContentContainer}>
                    <Helmet title={`Streamr Core | ${I18n.t('userpages.canvases.title')}`} />
                    {!fetching && canvases && !canvases.length && (
                        <NoCanvasesView
                            hasFilter={!!filter && (!!filter.search || !!filter.key)}
                            filter={filter}
                            onResetFilter={this.resetFilter}
                        />
                    )}
                    <TileGrid>
                        {canvases.map((canvas) => (
                            <Link
                                key={canvas.id}
                                to={`${links.editor.canvasEditor}/${canvas.id}`}
                            >
                                <Tile
                                    dropdownActions={this.getActions(canvas)}
                                    onMenuToggle={this.onToggleStreamDropdown(canvas.id)}
                                    image={<CanvasPreview className={cx(styles.PreviewImage, TileStyles.image)} canvas={canvas} />}
                                >
                                    <Tile.Title>{canvas.name}</Tile.Title>
                                    <Tile.Description>
                                        {canvas.updated === canvas.created ? 'Created ' : 'Updated '}
                                        {this.generateTimeAgoDescription(new Date(canvas.updated))}
                                    </Tile.Description>
                                    <Tile.Status
                                        className={
                                            cx({
                                                [styles.running]: canvas.state === RunStates.Running,
                                                [styles.stopped]: canvas.state === RunStates.Stopped,
                                            })}
                                    >
                                        {capital(canvas.state)}
                                    </Tile.Status>
                                </Tile>
                            </Link>
                        ))}
                    </TileGrid>
                </ListContainer>
                <DocsShortcuts />
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    user: selectUserData(state),
    canvases: selectCanvases(state),
    filter: selectFilter(state),
    fetching: selectFetching(state),
    fetchingPermissions: selectFetchingPermissions(state),
    permissions: selectCanvasPermissions(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCanvases: () => dispatch(getCanvases()),
    getCanvasPermissions: (id) => dispatch(getResourcePermissions('CANVAS', id, false)),
    deleteCanvas: (id) => dispatch(deleteCanvas(id)),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    navigate: (to) => dispatch(push(to)),
    copyToClipboard: (text) => copy(text),
})

export default connect(mapStateToProps, mapDispatchToProps)(CanvasList)
