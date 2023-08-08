import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MarketplaceHelmet } from '~/shared/components/Helmet'
import ProjectsComponent, { ProjectsContainer } from '~/marketplace/components/Projects'
import ActionBar from '~/components/ActionBars/ActionBar'
import Layout from '~/shared/components/Layout'
import Footer from '~/shared/components/Layout/Footer'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import useModal from '~/shared/hooks/useModal'
import CreateProjectModal from '~/marketplace/containers/CreateProjectModal'
import { SearchFilter } from '~/marketplace/types/project-types'
import { getProjects, searchProjects } from '~/services/projects'
import useDeepEqualMemo from '~/shared/hooks/useDeepEqualMemo'
import { useWalletAccount } from '~/shared/stores/wallet'
import { TheGraph } from '~/shared/types'
import styles from './projects.pcss'

const PAGE_SIZE = 16

type Filter = {
    search: string
    type: TheGraph.ProjectType | null
    owner: string | null
}

const EMPTY_FILTER: Filter = {
    search: '',
    type: null,
    owner: null,
}

const ProjectsPage: FunctionComponent = () => {
    const [filterValue, setFilter] = useState<Filter>(EMPTY_FILTER)
    const filter = useDeepEqualMemo(filterValue)
    const { api: createProductModal } = useModal('marketplace.createProduct')
    const account = useWalletAccount()

    const query = useInfiniteQuery({
        queryKey: ['projects', filter.owner, filter.search, filter.type],
        queryFn: (ctx) => {
            if (filter.search != null && filter.search.length > 0) {
                return searchProjects(filter.search, PAGE_SIZE, ctx.pageParam)
            } else {
                return getProjects(
                    filter.owner ?? undefined,
                    PAGE_SIZE,
                    ctx.pageParam,
                    filter.type ?? undefined,
                )
            }
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasNextPage ? pages.flatMap((p) => p.projects).length : null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    const onFilterChange = useCallback((newFilter: Filter) => {
        setFilter((prev) => ({ ...prev, ...newFilter }))
    }, [])

    const onSearchChange = useCallback((search: SearchFilter) => {
        setFilter((prev) => ({ ...prev, search }))
    }, [])

    const onFilterByAuthorChange = useCallback(
        (myProjects: boolean): void => {
            setFilter((prev) => ({
                ...prev,
                owner: myProjects && account ? account : null,
            }))
        },
        [account],
    )

    useEffect(() => {
        setFilter((filter) =>
            filter.owner && account ? { ...filter, owner: account } : filter,
        )
    }, [account])

    const noOwnProjects = !!filter.owner && !filter.search && !filter.type

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <MarketplaceHelmet title="Projects" />
            <ActionBar
                filter={filter}
                onFilterChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProject={() => createProductModal.open()}
                onFilterByAuthorChange={onFilterByAuthorChange}
                isUserAuthenticated={!!account}
            />
            <LoadingIndicator
                loading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            />
            <CreateProjectModal />
            <ProjectsContainer>
                <ProjectsComponent
                    projects={query.data?.pages.flatMap((d) => d.projects) ?? []}
                    currentUserAddress={account}
                    error={query.error}
                    type="projects"
                    isFetching={query.status === 'loading'}
                    loadProducts={() => query.fetchNextPage()}
                    hasMoreSearchResults={query.hasNextPage}
                    noOwnProjects={noOwnProjects}
                />
            </ProjectsContainer>
            <Footer />
        </Layout>
    )
}

export default ProjectsPage
