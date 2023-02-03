import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProjectsComponent, { ProjectsContainer } from '$mp/components/Projects'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProductModal from '$mp/containers/CreateProductModal'
import type { SearchFilter } from '$mp/types/project-types'
import { getProjects, searchProjects, TheGraphProject } from '$app/src/services/projects'
import { selectUsername } from '$shared/modules/user/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'
import useDeepEqualMemo from '$shared/hooks/useDeepEqualMemo'
import { isAuthenticated } from '$shared/modules/user/selectors'
import styles from './projects.pcss'

const PAGE_SIZE = 12

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
    const [projects, setProjects] = useState<TheGraphProject[]>([])
    const [projectsError, setProjectsError] = useState<string | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [filterValue, setFilter] = useState(EMPTY_FILTER)
    const filter = useDeepEqualMemo(filterValue)
    const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false)

    const { api: createProductModal } = useModal('marketplace.createProduct')
    const isUserAuthenticated = useSelector(isAuthenticated)
    const userAddress = useSelector(selectUsername)
    const isMounted = useIsMounted()
    const productsRef = useRef<TheGraphProject[]>()
    productsRef.current = projects

    const loadProjects = useCallback(async (replace = true) => {
        const limit = PAGE_SIZE + 1 // +1 to determine if we should show "load more" button
        const offset = replace ? 0 : productsRef.current && productsRef.current.length
        setIsFetching(true)

        let result = []

        try {
            if (filter.search != null && filter.search.length > 0) {
                result = await searchProjects(filter.search, limit, offset)
            } else {
                result = await getProjects(filter.owner, limit, offset)
            }
            setProjectsError(null)
        } catch (e) {
            console.error(e)
            setProjectsError(e)
        }

        if (isMounted()) {
            setIsFetching(false)

            if (result) {
                const hasMore = result.length > PAGE_SIZE
                setHasMoreSearchResults(hasMore)

                if (hasMore) {
                    // Splice to get rid of extra element from "load more" check
                    result.splice(PAGE_SIZE, 1)
                }

                if (replace) {
                    setProjects(result)
                } else {
                    setProjects((prev) => ([
                        ...prev,
                        ...result,
                    ]))
                }
            }
        }
    }, [isMounted, filter])

    const onFilterChange = useCallback((newFilter: Filter) => {
        setFilter((prev) => ({ ...prev, ...newFilter }))
    }, [])

    const onSearchChange = useCallback((search: SearchFilter) => {
        setFilter((prev) => ({ ...prev, search }))
    }, [])

    const onFilterByAuthorChange = useCallback((myProjects: boolean): void => {
        setFilter((prev) => ({
            ...prev,
            owner: myProjects ? userAddress : null,
        }))
    }, [userAddress])

    const clearFiltersAndReloadProducts = useCallback(() => {
        setFilter(EMPTY_FILTER)
    }, [])

    useEffect(() => {
        if (productsRef.current && productsRef.current.length === 0) {
            clearFiltersAndReloadProducts()
        }
    }, [clearFiltersAndReloadProducts])

    useEffect(() => {
        loadProjects()
    }, [loadProjects])

    return (
        <Layout className={styles.projectsListPage} framedClassName={styles.productsFramed} innerClassName={styles.productsInner} footer={false}>
            <MarketplaceHelmet />
            <ActionBar
                filter={filter}
                categories={[]}
                onFilterChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProject={() => createProductModal.open()}
                onFilterByAuthorChange={onFilterByAuthorChange}
                isUserAuthenticated={isUserAuthenticated}
            />
            <CreateProductModal />
            <ProjectsContainer fluid>
                <ProjectsComponent
                    projects={projects}
                    error={projectsError}
                    type="projects"
                    isFetching={isFetching}
                    loadProducts={() => { loadProjects(false) }}
                    hasMoreSearchResults={hasMoreSearchResults}
                />
            </ProjectsContainer>
            <Footer />
        </Layout>
    )
}

export default ProjectsPage
