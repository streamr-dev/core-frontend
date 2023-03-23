import React, {FunctionComponent, useCallback, useEffect, useReducer, useRef, useState} from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProjectsComponent, { ProjectsContainer } from '$mp/components/Projects'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProjectModal from '$mp/containers/CreateProjectModal'
import { SearchFilter } from '$mp/types/project-types'
import { getProjects, searchProjects } from '$app/src/services/projects'
import { useAuthController } from '$auth/hooks/useAuthController'
import useDeepEqualMemo from '$shared/hooks/useDeepEqualMemo'
import { useIsAuthenticated } from '$auth/hooks/useIsAuthenticated'

import styles from './projects.pcss'

const PAGE_SIZE = 16

type Filter = {
    search: string,
    type: string,
    owner: string | null,
}

const EMPTY_FILTER: Filter = {
    search: '',
    type: '',
    owner: null,
}

const ProjectsPage: FunctionComponent = () => {
    const [filterValue, setFilter] = useState(EMPTY_FILTER)
    const filter = useDeepEqualMemo(filterValue)
    const { api: createProductModal } = useModal('marketplace.createProduct')
    const isUserAuthenticated = useIsAuthenticated()
    const { currentAuthSession } = useAuthController()

    const query = useInfiniteQuery({
        queryKey: ["projects", filter.owner, filter.search],
        queryFn: (ctx) => {
            if (filter.search != null && filter.search.length > 0) {
                return searchProjects(filter.search, PAGE_SIZE, ctx.pageParam)
            } else {
                return getProjects(filter.owner, PAGE_SIZE, ctx.pageParam)
            }
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasNextPage ? pages.length : null
        },
    })

    const onFilterChange = useCallback((newFilter: Filter) => {
        setFilter((prev) => ({ ...prev, ...newFilter }))
    }, [])

    const onSearchChange = useCallback((search: SearchFilter) => {
        setFilter((prev) => ({ ...prev, search }))
    }, [])

    const onFilterByAuthorChange = useCallback((myProjects: boolean): void => {
        setFilter((prev) => ({
            ...prev,
            owner: myProjects ? currentAuthSession.address : null,
        }))
    }, [currentAuthSession])

    useEffect(() => {
        setFilter((filter) => (filter.owner ? { ...filter, owner: currentAuthSession.address } : filter))
    }, [currentAuthSession.address])

    return (
        <Layout className={styles.projectsListPage} framedClassName={styles.productsFramed} innerClassName={styles.productsInner} footer={false}>
            <MarketplaceHelmet title="Projects" />
            <ActionBar
                filter={filter}
                categories={[]}
                onFilterChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProject={() => createProductModal.open()}
                onFilterByAuthorChange={onFilterByAuthorChange}
                isUserAuthenticated={isUserAuthenticated}
            />
            <CreateProjectModal />
            <ProjectsContainer>
                <ProjectsComponent
                    projects={query.data?.pages.flatMap((d) => d.projects) ?? []}
                    currentUserAddress={currentAuthSession?.address}
                    error={query.error}
                    type="projects"
                    isFetching={query.status === 'loading'}
                    loadProducts={() => query.fetchNextPage()}
                    hasMoreSearchResults={query.hasNextPage}
                />
            </ProjectsContainer>
            <Footer />
        </Layout>
    )
}

export default ProjectsPage
