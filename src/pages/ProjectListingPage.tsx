import React, { useReducer } from 'react'
import isEqual from 'lodash/isEqual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import Layout from '~/components/Layout'
import ActionBar, { isOwnedTabOption } from '~/components/ActionBar'
import { useWalletAccount } from '~/shared/stores/wallet'
import useModal from '~/shared/hooks/useModal'
import { getProjects, getProjectsByText } from '~/services/projects'
import { ProjectFilter } from '~/types'
import { MaxSearchPhraseLength } from '~/consts'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import CreateProjectModal from '~/marketplace/containers/CreateProjectModal'
import { Projects, ProjectsContainer } from '~/marketplace/components/Projects'
import { useCurrentChainId } from '~/utils/chains'

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

    const [params] = useSearchParams()

    const owner = isOwnedTabOption(params.get('tab')) ? account : undefined

    const { api: createProductModal } = useModal('marketplace.createProduct')

    const currentChainId = useCurrentChainId()

    const query = useInfiniteQuery({
        queryKey: ['projects', currentChainId, owner, filter.search, filter.type],
        queryFn({ pageParam: page }) {
            const { search, type: projectType } = filter

            const params = {
                chainId: currentChainId,
                first: PageSize,
                owner,
                projectType,
                skip: page,
            }

            if (search) {
                return getProjectsByText(search, params)
            }

            return getProjects(params)
        },
        getNextPageParam(lastPage, pages) {
            return lastPage.hasNextPage ? pages.flatMap((p) => p.projects).length : null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    const noOwnProjects = !!owner && !filter.search && !filter.type

    return (
        <Layout pageTitle="Projects">
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
                <Projects
                    projects={query.data?.pages.flatMap((d) => d.projects) ?? []}
                    currentUserAddress={account}
                    error={query.error}
                    isFetching={query.status === 'loading'}
                    loadProducts={() => void query.fetchNextPage()}
                    hasMoreSearchResults={query.hasNextPage}
                    noOwnProjects={noOwnProjects}
                />
            </ProjectsContainer>
        </Layout>
    )
}
