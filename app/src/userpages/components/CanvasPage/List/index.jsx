// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { capital } from 'case'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'

import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import type { Canvas, CanvasId } from '$userpages/flowtype/canvas-types'

import Layout from '$userpages/components/Layout'
import links from '$app/src/links'
import { getCanvases, deleteCanvas, updateFilter } from '$userpages/modules/canvas/actions'
import { selectCanvases, selectFilter, selectFetching } from '$userpages/modules/canvas/selectors'
import { defaultColumns, getFilters } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import DropdownActions from '$shared/components/DropdownActions'
import { formatExternalUrl } from '$shared/utils/url'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'
import ShareDialog from '$userpages/components/ShareDialog'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectCanvasPermissions } from '$userpages/modules/permission/selectors'
import type { Permission, ResourceId } from '$userpages/flowtype/permission-types'
import type { User } from '$shared/flowtype/user-types'
import { selectUserData } from '$shared/modules/user/selectors'

export type StateProps = {
    user: ?User,
    canvases: Array<Canvas>,
    filter: ?Filter,
    fetchingPermissions: boolean,
    permissions: {
        [ResourceId]: Array<Permission>,
    },
    fetching: boolean,
}

export type DispatchProps = {
    getCanvases: () => void,
    deleteCanvas: (id: string) => void,
    updateFilter: (filter: Filter) => void,
    navigate: (to: string) => void,
    copyToClipboard: (text: string) => void,
    getCanvasPermissions: (id: CanvasId) => void,
}

type Props = StateProps & DispatchProps

type State = {
    shareDialogCanvas: ?Canvas,
}

const CreateCanvasButton = () => (
    <Button color="primary">
        <Link to={links.editor.canvasEditor}>
            <Translate value="userpages.canvases.createCanvas" />
        </Link>
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.RECENT,
        filters.RUNNING,
        filters.STOPPED,
        filters.SHARED,
        filters.MINE,
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
        const confirmed = await confirmDialog({
            title: I18n.t('userpages.canvases.delete.confirmTitle', {
                canvas: canvas.name,
            }),
            message: I18n.t('userpages.canvases.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.canvases.delete.confirmButton'),
                color: 'danger',
            },
            centerButtons: true,
        })

        if (confirmed) {
            this.props.deleteCanvas(canvas.id)
        }
    }

    loadCanvasPermissions = (id: CanvasId) => {
        const { permissions, getCanvasPermissions, fetchingPermissions } = this.props

        if (!fetchingPermissions && !permissions[id]) {
            getCanvasPermissions(id)
        }
    }

    hasWritePermission = (id: CanvasId) => {
        const { fetchingPermissions, permissions, user } = this.props

        return (
            !fetchingPermissions &&
            !!user &&
            permissions[id] &&
            permissions[id].find((p: Permission) => p.user === user.username && p.operation === 'write') !== undefined
        )
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

    getActions = (canvas) => {
        const { navigate, copyToClipboard } = this.props

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
                    onClick={() => this.onOpenShareDialog(canvas)}
                >
                    <Translate value="userpages.canvases.menu.share" />
                </DropdownActions.Item>
                <DropdownActions.Item onClick={() => copyToClipboard(editUrl)}>
                    <Translate value="userpages.canvases.menu.copyUrl" />
                </DropdownActions.Item>
                <DropdownActions.Item
                    disabled={!this.hasWritePermission(canvas.id)}
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
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
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
                    />
                )}
                <Container>
                    <Helmet>
                        <title>{I18n.t('userpages.canvases.title')}</title>
                    </Helmet>
                    {!canvases.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                        >
                            <Translate value="userpages.canvases.noCanvases.title" />
                            <Translate value="userpages.canvases.noCanvases.message" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {canvases.map((canvas) => {
                            let modulePreviews = canvas.modules.map((m) => ({
                                // $FlowFixMe
                                key: `${m.id}-${m.hash}`,
                                // $FlowFixMe
                                top: Number.parseFloat(m.layout.position.top),
                                // $FlowFixMe
                                left: Number.parseFloat(m.layout.position.left),
                                // $FlowFixMe
                                height: Number.parseFloat(m.layout.height) || 30,
                                // $FlowFixMe
                                width: Number.parseFloat(m.layout.width) || 100,
                            }))
                            const bounds = modulePreviews.reduce((b, m) => (
                                Object.assign(b, {
                                    maxX: Math.max(b.maxX, m.left + m.width),
                                    maxY: Math.max(b.maxY, m.top + m.height),
                                    minX: Math.min(b.minX, m.left),
                                    minY: Math.min(b.minY, m.top),
                                })
                            ), {
                                maxX: -Infinity,
                                maxY: -Infinity,
                                minX: Infinity,
                                minY: Infinity,
                            })

                            const width = Math.max(bounds.maxX - bounds.minX, window.innerWidth)
                            const height = Math.max(bounds.maxY - bounds.minY, window.innerHeight)
                            modulePreviews = modulePreviews.map((m) => ({
                                ...m,
                                top: (m.top - bounds.minY) / height,
                                left: (m.left - bounds.minX) / width,
                                width: m.width / width,
                                height: m.height / height,
                            }))
                            const preview = (
                                <svg
                                    preserveAspectRatio="xMidYMid meet"
                                    height="100%"
                                    width="100%"
                                    viewBox="0 0 100 100"
                                    style={{
                                        background: '#e7e7e7',
                                    }}
                                >
                                    {modulePreviews.map((m) => (
                                        <rect
                                            key={m.key}
                                            fill="white"
                                            stroke="#eee"
                                            strokeWidth="0.5px"
                                            y={2 + (m.top * 96)}
                                            x={2 + (m.left * 96)}
                                            width={2 + (m.width * 96)}
                                            height={2 + (m.height * 96)}
                                        />
                                    ))}
                                </svg>
                            )
                            return (
                                <Col {...defaultColumns} key={canvas.id}>
                                    <Tile
                                        link={`${links.editor.canvasEditor}/${canvas.id}`}
                                        dropdownActions={this.getActions(canvas)}
                                        image={preview}
                                        onMenuToggle={(open) => {
                                            if (open) {
                                                this.loadCanvasPermissions(canvas.id)
                                            }
                                        }}
                                    >
                                        <Tile.Title>{canvas.name}</Tile.Title>
                                        <Tile.Description>{new Date(canvas.updated).toLocaleString()}</Tile.Description>
                                        <Tile.Status>{capital(canvas.state)}</Tile.Status>
                                    </Tile>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    user: selectUserData(state),
    canvases: selectCanvases(state),
    filter: selectFilter(state),
    fetchingPermissions: selectFetchingPermissions(state),
    permissions: selectCanvasPermissions(state),
    fetching: selectFetching(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCanvases: () => dispatch(getCanvases()),
    deleteCanvas: (id) => dispatch(deleteCanvas(id)),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    navigate: (to) => dispatch(push(to)),
    copyToClipboard: (text) => copy(text),
    getCanvasPermissions: (id: CanvasId) => dispatch(getResourcePermissions('CANVAS', id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CanvasList)
