// @flow

import React, { useMemo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import links from '$userpages/../links'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import Layout from '$userpages/components/Layout'
import { getFilters } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import TileStyles from '$shared/components/Tile/tile.pcss'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import DashboardPreview from '$editor/dashboard/components/Preview'
import styles from './dashboardList.pcss'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'

import NoDashboardsView from './NoDashboards'

const CreateDashboardButton = () => (
    <Button
        className={styles.createDashboardButton}
        tag={Link}
        to={links.editor.dashboardEditor}
    >
        <Translate value="userpages.dashboards.createDashboard" />
    </Button>
)

const DashboardList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
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
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDashboards(filter))
    }, [dispatch, filter])

    const onSearchChange = useCallback((value: string) => {
        setSearch(value)
    }, [setSearch])

    const onSortChange = useCallback((sortOptionId) => {
        setSort(sortOptionId)
    }, [setSort])

    return (
        <Layout
            headerAdditionalComponent={<CreateDashboardButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.dashboards.filterDashboards')}
                    value={(filter && filter.search) || ''}
                    onChange={onSearchChange}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={onSortChange}
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
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.dashboards')}`} />
            <ListContainer className={styles.corepageContentContainer} >
                {!fetching && dashboards && dashboards.length <= 0 && (
                    <NoDashboardsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {dashboards && dashboards.length > 0 && (
                    <TileGrid>
                        {dashboards.map((dashboard) => (
                            <Link
                                key={dashboard.id}
                                to={`${links.editor.dashboardEditor}/${dashboard.id}`}
                            >
                                <Tile
                                    image={<DashboardPreview className={cx(styles.PreviewImage, TileStyles.image)} dashboard={dashboard} />}
                                >
                                    <Tile.Title>{dashboard.name}</Tile.Title>
                                </Tile>
                            </Link>
                        ))}
                    </TileGrid>
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default DashboardList
