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

import type { Filter } from '$userpages/flowtype/common-types'
import type { Canvas } from '$userpages/flowtype/canvas-types'

import Layout from '$userpages/components/Layout'
import links from '$app/src/links'
import { getCanvases, getCanvasesDebounced, deleteCanvas, updateFilter } from '$userpages/modules/canvas/actions'
import { selectCanvases, selectFilter } from '$userpages/modules/canvas/selectors'
import { defaultColumns } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import DropdownActions from '$shared/components/DropdownActions'
import { formatExternalUrl } from '$shared/utils/url'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'

export type StateProps = {
    canvases: Array<Canvas>,
    filter: ?Filter,
}

export type DispatchProps = {
    getCanvases: () => void,
    getCanvasesDebounced: () => void,
    deleteCanvas: (id: string) => void,
    updateFilter: (filter: Filter) => void,
    navigate: (to: string) => void,
    copyToClipboard: (text: string) => void,
}

type Props = StateProps & DispatchProps

const CreateCanvasButton = () => (
    <Button>
        <Link to={links.userpages.canvasEditor}>
            <Translate value="userpages.canvases.createCanvas" />
        </Link>
    </Button>
)

type SortOption = {
    displayName: string,
    filter: Filter,
}

const sortOptions = (): Array<SortOption> => [
    {
        displayName: I18n.t('userpages.canvases.filter.recent'),
        filter: {
            id: 'recent',
            sortBy: 'lastUpdated',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.running'),
        filter: {
            id: 'running',
            key: 'state',
            value: 'RUNNING',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.stopped'),
        filter: {
            id: 'stopped',
            key: 'state',
            value: 'STOPPED',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.shared'),
        filter: {
            id: 'shared',
            key: 'operation',
            value: 'SHARE',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.mine'),
        filter: {
            id: 'mine',
            key: 'operation',
            value: 'WRITE',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.az'),
        filter: {
            id: 'az',
            sortBy: 'name',
            order: 'asc',
        },
    },
    {
        displayName: I18n.t('userpages.canvases.filter.za'),
        filter: {
            id: 'za',
            sortBy: 'name',
            order: 'desc',
        },
    },
]

class CanvasList extends Component<Props, StateProps> {
    componentDidMount() {
        // Set default filter if not selected
        if (!this.props.filter) {
            const defaultFilter = sortOptions()[0].filter
            this.props.updateFilter({
                id: defaultFilter.id,
                sortBy: defaultFilter.sortBy,
                order: defaultFilter.order,
            })
        }
        this.props.getCanvases()
    }

    getActions = (canvas) => {
        const { navigate, deleteCanvas, copyToClipboard } = this.props

        const editUrl = formatExternalUrl(
            process.env.PLATFORM_ORIGIN_URL,
            process.env.PLATFORM_BASE_PATH,
            `${links.userpages.canvasEditor}/${canvas.id}`,
        )

        return (
            <Fragment>
                <DropdownActions.Item onClick={() => navigate(`${links.userpages.canvasEditor}/${canvas.id}`)}>
                    <Translate value="userpages.canvases.menu.edit" />
                </DropdownActions.Item>
                <DropdownActions.Item
                    onClick={() => console.error('Not implemented')}
                >
                    <Translate value="userpages.canvases.menu.share" />
                </DropdownActions.Item>
                <DropdownActions.Item onClick={() => copyToClipboard(editUrl)}>
                    <Translate value="userpages.canvases.menu.copyUrl" />
                </DropdownActions.Item>
                <DropdownActions.Item onClick={() => deleteCanvas(canvas.id)}>
                    <Translate value="userpages.canvases.menu.delete" />
                </DropdownActions.Item>
            </Fragment>
        )
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getCanvasesDebounced } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getCanvasesDebounced()
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter, getCanvases } = this.props
        const sortOption = sortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                ...filter,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
            getCanvases()
        }
    }

    render() {
        const { canvases, filter } = this.props

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
                        title={I18n.t('userpages.canvases.sortBy')}
                        onChange={this.onSortChange}
                        selectedValue={(filter && filter.id) || null}
                    >
                        {sortOptions().map((s) => (
                            <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                {s.displayName}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                }
            >
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
                        {canvases.map((canvas) => (
                            <Col {...defaultColumns} key={canvas.id}>
                                <Tile
                                    link={`${links.userpages.canvasEditor}/${canvas.id}`}
                                    dropdownActions={this.getActions(canvas)}
                                >
                                    <Tile.Title>{canvas.name}</Tile.Title>
                                    <Tile.Description>{new Date(canvas.updated).toLocaleString()}</Tile.Description>
                                    <Tile.Status>{capital(canvas.state)}</Tile.Status>
                                </Tile>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    canvases: selectCanvases(state),
    filter: selectFilter(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCanvases: () => dispatch(getCanvases()),
    getCanvasesDebounced: () => dispatch(getCanvasesDebounced()),
    deleteCanvas: (id) => dispatch(deleteCanvas(id)),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    navigate: (to) => dispatch(push(to)),
    copyToClipboard: (text) => copy(text),
})

export default connect(mapStateToProps, mapDispatchToProps)(CanvasList)
