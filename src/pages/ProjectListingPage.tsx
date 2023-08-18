import React, { useReducer } from 'react'
import Layout from '~/shared/components/Layout'
import isEqual from 'lodash/isEqual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MarketplaceHelmet } from '~/shared/components/Helmet'
import ActionBar from '~/components/ActionBar'
import { useWalletAccount } from '~/shared/stores/wallet'
import useModal from '~/shared/hooks/useModal'
import { getProjects, searchProjects } from '~/services/projects'
import { ProjectFilter } from '~/types'
import { MaxSearchPhraseLength } from '~/consts'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import CreateProjectModal from '~/marketplace/containers/CreateProjectModal'
import ProjectsComponent, { ProjectsContainer } from '~/marketplace/components/Projects'
import Footer from '~/shared/components/Layout/Footer'
import styles from './ProjectListingPage.pcss'

const DefaultFilter: ProjectFilter = {
    search: '',
}

const PageSize = 16

function filterReducer(
    state: ProjectFilter,
    partial: Partial<ProjectFilter>,
): ProjectFilter {
    const proposalState: ProjectFilter = { ...state, ...partial }

    proposalState.search = proposalState.search.slice(0, MaxSearchPhraseLength)

    return isEqual(state, proposalState) ? state : proposalState
}

export default function ProjectListingPage() {
    const [filter, setFilter] = useReducer(filterReducer, DefaultFilter)

    const account = useWalletAccount()

    const { api: createProductModal } = useModal('marketplace.createProduct')

    const query = useInfiniteQuery({
        queryKey: ['projects', filter.owner, filter.search, filter.type],
        queryFn({ pageParam: page }) {
            const { search, owner, type } = filter

            if (search) {
                return searchProjects(search, PageSize, page)
            }

            return getProjects(owner, PageSize, page, type)
        },
        getNextPageParam(lastPage, pages) {
            return lastPage.hasNextPage ? pages.flatMap((p) => p.projects).length : null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

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
                onFilterChange={setFilter}
                onCreateProject={() => void createProductModal.open()}
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
