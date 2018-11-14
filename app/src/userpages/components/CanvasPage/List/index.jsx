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

import type { Filter } from '../../../flowtype/common-types'
import type { Canvas } from '../../../flowtype/canvas-types'

import Layout from '../../Layout'
import links from '../../../../links'
import { getCanvases, getCanvasesDebounced, deleteCanvas, updateFilter } from '../../../modules/canvas/actions'
import { selectCanvases, selectFilter } from '../../../modules/canvas/selectors'
import { defaultColumns } from '../../../utils/constants'
import Tile from '$shared/components/Tile'
import DropdownActions from '$shared/components/DropdownActions'
import { formatExternalUrl } from '$shared/utils/url'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

import FilterSelector from '$mp/components/ActionBar/FilterSelector'
import FilterDropdownItem from '$mp/components/ActionBar/FilterDropdownItem'

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

const searchComponent = (currentValue, onChange: (e: SyntheticInputEvent<EventTarget>) => void) => (
    <input value={currentValue || ''} onChange={onChange} />
)

const sortOptions = [
    {
        id: 'recent',
        apiName: 'lastUpdated',
        displayName: 'Recent',
    },
    {
        id: 'state',
        apiName: 'state',
        displayName: 'State',
    },
]

const sortDropdownComponent = (currentSelection, onChange: Function) => (
    <FilterSelector
        title="Sort by"
        selected={currentSelection}
        onClear={() => onChange(null)}
    >
        {!!sortOptions && sortOptions.map((s) => (
            <FilterDropdownItem
                key={s.id}
                value={s.id}
                selected={s.id === currentSelection}
                onSelect={onChange}
            >
                {s.displayName}
            </FilterDropdownItem>
        ))}
    </FilterSelector>
)

class CanvasList extends Component<Props> {
    componentDidMount() {
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

    onSearchChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { filter, updateFilter, getCanvasesDebounced } = this.props
        const newFilter = {
            ...filter,
            search: e.target.value,
        }
        updateFilter(newFilter)
        getCanvasesDebounced()
    }

    onSortChange = (sortOption) => {
        const { filter, updateFilter, getCanvases } = this.props
        const apiField = this.mapSortByFromIdToApi(sortOption)

        const newFilter = {
            ...filter,
            sortBy: apiField,
        }
        updateFilter(newFilter)
        getCanvases()
    }

    mapSortByFromIdToApi = (id: ?string) => {
        const filtered = sortOptions.filter((s) => s.id === id)
        return (filtered && filtered.length > 0 && filtered[0].apiName) || null
    }

    mapSortByFromApiToDisplayName = (apiSortBy: ?string) => {
        const filtered = sortOptions.filter((s) => s.apiName === apiSortBy)
        return (filtered && filtered.length > 0 && filtered[0].displayName) || null
    }

    render() {
        const { canvases, filter } = this.props

        return (
            <Layout
                headerAdditionalComponent={<CreateCanvasButton />}
                headerSearchComponent={searchComponent(filter && filter.search, this.onSearchChange)}
                headerFilterComponent={sortDropdownComponent(this.mapSortByFromApiToDisplayName(filter && filter.sortBy), this.onSortChange)}
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
