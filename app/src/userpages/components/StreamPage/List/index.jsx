// @flow

import React, { Fragment, useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
import {
    getStreams,
    clearStreamsList,
} from '$userpages/modules/userPageStreams/actions'
import { selectStreams, selectFetching, selectHasMoreSearchResults } from '$userpages/modules/userPageStreams/selectors'
import { getFilters } from '$userpages/utils/constants'
import Popover from '$shared/components/Popover'
import Layout from '$userpages/components/Layout'
import { resetResourcePermission } from '$userpages/modules/permission/actions'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import LoadMore from '$mp/components/LoadMore'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import { MD, LG } from '$shared/utils/styled'
import { StreamList as StreamListComponent } from '$shared/components/List'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import routes from '$routes'

import Search from '../../Header/Search'

import SnippetDialog from './SnippetDialog'
import Row from './Row'
import NoStreamsView from './NoStreams'

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

export const CreateStreamButton = () => (
    <DesktopOnlyButton
        tag={Link}
        to={routes.streams.new()}
    >
        <Translate value="userpages.streams.createStream" />
    </DesktopOnlyButton>
)

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

const TabletPopover = styled(Popover)`
    @media (min-width: ${LG}px) {
        display: none;
    }
`

function StreamPageSidebar({ stream }) {
    const sidebar = useSidebar()
    const dispatch = useDispatch()

    const streamId = stream && stream.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (streamId) {
            dispatch(resetResourcePermission('STREAM', streamId))
        }
    }, [sidebar, dispatch, streamId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && truncate(stream.id)}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const StreamList = () => {
    const filters = useMemo(() => getFilters('stream'), [])
    const allSortOptions = useMemo(() => ([
        filters.RECENT_DESC,
        filters.RECENT_ASC,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]), [filters])
    const dropdownSortOptions = useMemo(() => ([
        filters.RECENT_DESC,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]), [filters])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(allSortOptions)
    const [dialogTargetStream, setDialogTargetStream] = useState(null)
    const dispatch = useDispatch()
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetching)
    const hasMoreResults = useSelector(selectHasMoreSearchResults)

    useEffect(() => () => {
        dispatch(clearStreamsList())
    }, [dispatch])

    const fetchStreams = useCallback(async (...args) => {
        try {
            await dispatch(getStreams(...args))
        } catch (e) {
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
        }
    }, [dispatch])

    useEffect(() => {
        fetchStreams({
            replace: true,
            filter,
        })
    }, [fetchStreams, filter])

    const [activeSort, setActiveSort] = useState(undefined)

    const sidebar = useSidebar()

    const onOpenShareDialog = useCallback((stream) => {
        setDialogTargetStream(stream)
        sidebar.open('share')
    }, [sidebar])

    const onDropdownSort = useCallback((value) => {
        setActiveSort(value)
        setSort(value)
    }, [setSort])

    const onHeaderSortUpdate = useCallback((asc, desc) => {
        setActiveSort((prevFilter) => {
            let nextSort

            if (![asc, desc].includes(prevFilter)) {
                nextSort = asc
            } else if (prevFilter === asc) {
                nextSort = desc
            }

            setSort(nextSort || (defaultFilter && defaultFilter.id))
            return nextSort
        })
    }, [setActiveSort, setSort, defaultFilter])

    return (
        <Layout
            headerAdditionalComponent={<CreateStreamButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder={I18n.t('userpages.streams.filterStreams')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <TabletPopover
                    title={I18n.t('userpages.filter.sortBy')}
                    type="uppercase"
                    caret="svg"
                    activeTitle
                    onChange={onDropdownSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    menuProps={{
                        right: true,
                    }}
                >
                    {dropdownSortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </TabletPopover>
            }
            loading={fetching}
        >
            <CoreHelmet title={I18n.t('userpages.title.streams')} />
            <StyledListContainer>
                {!fetching && streams && streams.length <= 0 && (
                    <NoStreamsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {streams && streams.length > 0 && (
                    <Fragment>
                        <StreamListComponent>
                            <StreamListComponent.Header>
                                <StreamListComponent.HeaderItem
                                    asc={filters.NAME_ASC.filter.id}
                                    desc={filters.NAME_DESC.filter.id}
                                    active={activeSort}
                                    onClick={onHeaderSortUpdate}
                                >
                                    <Translate value="userpages.streams.list.name" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem>
                                    <Translate value="userpages.streams.list.description" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem
                                    asc={filters.RECENT_ASC.filter.id}
                                    desc={filters.RECENT_DESC.filter.id}
                                    active={activeSort}
                                    onClick={onHeaderSortUpdate}
                                >
                                    <Translate value="userpages.streams.list.updated" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem>
                                    <Translate value="userpages.streams.list.lastData" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem center>
                                    <Translate value="userpages.streams.list.status" />
                                </StreamListComponent.HeaderItem>
                            </StreamListComponent.Header>
                            {streams.map((stream) => (
                                <Row
                                    key={stream.id}
                                    onShareClick={onOpenShareDialog}
                                    stream={stream}
                                />
                            ))}
                        </StreamListComponent>
                        <LoadMore
                            hasMoreSearchResults={!fetching && hasMoreResults}
                            onClick={() => fetchStreams()}
                            preserveSpace
                        />
                    </Fragment>
                )}
            </StyledListContainer>
            <SnippetDialog />
            <StreamPageSidebar stream={dialogTargetStream} />
            <DocsShortcuts />
        </Layout>
    )
}

export default (props: any) => (
    <SidebarProvider>
        <StreamList {...props} />
    </SidebarProvider>
)
