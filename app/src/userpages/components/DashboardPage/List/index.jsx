// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import routes from '$routes'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import Layout from '$userpages/components/Layout'
import { getFilters } from '$userpages/utils/constants'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import styles from './dashboardList.pcss'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import { DashboardTile } from '$shared/components/Tile'
import Grid from '$shared/components/Tile/Grid'

import NoDashboardsView from './NoDashboards'

const CreateDashboardButton = () => (
    <Button
        className={styles.createDashboardButton}
        tag={Link}
        to={routes.dashboards.edit({
            id: null,
        })}
    >
        <Translate value="userpages.dashboards.createDashboard" />
    </Button>
)

const DashboardList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('dashboard')
        return [
            filters.RECENT,
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

    return (
        <Layout
            headerAdditionalComponent={<CreateDashboardButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.dashboards.filterDashboards')}
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
                    <Grid>
                        {dashboards.map((dashboard) => (
                            <DashboardTile key={dashboard.id} dashboard={dashboard} />
                        ))}
                    </Grid>
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default DashboardList
