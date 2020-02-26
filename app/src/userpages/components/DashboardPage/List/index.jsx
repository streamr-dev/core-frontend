// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import moment from 'moment'

import links from '$userpages/../links'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import Layout from '$userpages/components/Layout'
import { getFilters } from '$userpages/utils/constants'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import DashboardPreview from '$editor/dashboard/components/Preview'
import styles from './dashboardList.pcss'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import Tile2 from '$shared/components/Tile2'
import Grid from '$shared/components/Tile2/Grid'
import Summary from '$shared/components/Tile2/Summary'
import ImageContainer, { Image } from '$shared/components/Tile2/ImageContainer'

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
                        {dashboards.map(({ created, updated, ...dashboard }) => (
                            <Tile2 key={dashboard.id}>
                                <Link to={`${links.editor.dashboardEditor}/${dashboard.id}`}>
                                    <ImageContainer>
                                        <Image
                                            as={DashboardPreview}
                                            dashboard={dashboard}
                                        />
                                    </ImageContainer>
                                    <Summary
                                        name={dashboard.name}
                                        updatedAt={`${updated === created ? 'Created' : 'Updated'} ${moment(new Date(updated)).fromNow()}`}
                                    />
                                </Link>
                            </Tile2>
                        ))}
                    </Grid>
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default DashboardList
