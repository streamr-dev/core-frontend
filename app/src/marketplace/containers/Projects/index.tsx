import React, {FunctionComponent, useCallback, useEffect, useReducer, useRef, useState} from 'react'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProjectsComponent, { ProjectsContainer } from '$mp/components/Projects'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProjectModal from '$mp/containers/CreateProjectModal'
import type {SearchFilter} from '$mp/types/project-types'
import {
    getProjects,
    getUserPermissionsForProject,
    searchProjects,
    TheGraphProject
} from '$app/src/services/projects'
import useIsMounted from '$shared/hooks/useIsMounted'
import {useAuthController} from "$auth/hooks/useAuthController"
import useDeepEqualMemo from '$shared/hooks/useDeepEqualMemo'
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"
import getCoreConfig from "$app/src/getters/getCoreConfig"
import {
    projectsPermissionsReducer,
    ProjectsPermissionsState
} from "$mp/modules/projectsPermissionsState/projectsPermissionsState"
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
    const {projectRegistry} = getCoreConfig()

    const { api: createProductModal } = useModal('marketplace.createProduct')
    const isUserAuthenticated = useIsAuthenticated()
    const {currentAuthSession} = useAuthController()
    const isMounted = useIsMounted()
    const productsRef = useRef<TheGraphProject[]>()
    productsRef.current = projects
    const [projectsPermissions, dispatchPermissionsUpdate] = useReducer(projectsPermissionsReducer, {} as ProjectsPermissionsState)

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
            owner: myProjects ? currentAuthSession.address : null,
        }))
    }, [currentAuthSession])

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
    }, [])

    useEffect(() => {
        if (currentAuthSession.address && projects?.length) {
            projects.forEach(async (project) => {
                const permissions = await getUserPermissionsForProject(projectRegistry.chainId, project.id, currentAuthSession.address)
                dispatchPermissionsUpdate({projectId: project.id, userAddress: currentAuthSession.address, permissions})
            })
        }
    }, [projects, currentAuthSession.address, projectRegistry.chainId])

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
            <ProjectsContainer fluid>
                <ProjectsComponent
                    projects={projects}
                    projectsPermissions={projectsPermissions}
                    currentUserAddress={currentAuthSession?.address}
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
