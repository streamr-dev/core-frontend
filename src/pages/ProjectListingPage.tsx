import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import isEqual from 'lodash/isEqual'
import React, { useReducer } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActionBar, {
    isOwnedTabOption,
    isTabOption,
    TabOption,
} from '~/components/ActionBar'
import Layout from '~/components/Layout'
import { MaxSearchPhraseLength, Minute } from '~/consts'
import { Projects, ProjectsContainer } from '~/marketplace/components/Projects'
import CreateProjectModal from '~/marketplace/containers/CreateProjectModal'
import { getProjects, getProjectsByText } from '~/services/projects'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import useModal from '~/shared/hooks/useModal'
import { useWalletAccount } from '~/shared/stores/wallet'
import { ProjectFilter } from '~/types'
import { useCurrentChainId } from '~/utils/chains'
import { useUrlParams } from '~/hooks/useUrlParams'
import { TheGraph } from '~/shared/types'

const PAGE_SIZE = 20
const DEFAULT_TAB = TabOption.Any
const DEFAULT_SEARCH = ''
const DEFAULT_TYPE = ''

function filterReducer(
    state: ProjectFilter,
    partial: Partial<ProjectFilter>,
): ProjectFilter {
    const proposalState: ProjectFilter = { ...state, ...partial }

    proposalState.search = proposalState.search.slice(0, MaxSearchPhraseLength)

    return isEqual(state, proposalState) ? state : proposalState
}

export default function ProjectListingPage() {
    const [params] = useSearchParams()

    const DefaultFilter: ProjectFilter = {
        search: params.get('search') || DEFAULT_SEARCH,
        type: (params.get('type') as TheGraph.ProjectType) || DEFAULT_TYPE,
    }

    const [filter, setFilter] = useReducer(filterReducer, DefaultFilter)

    const account = useWalletAccount()

    const tab = params.get('tab')
    const selectedTab = isTabOption(tab) ? tab : DEFAULT_TAB
    const owner = isOwnedTabOption(selectedTab) ? account : undefined

    useUrlParams([
        {
            param: 'tab',
            value: selectedTab,
            defaultValue: DEFAULT_TAB,
        },
        {
            param: 'search',
            value: filter.search,
            defaultValue: DEFAULT_SEARCH,
        },
        {
            param: 'type',
            value: filter.type,
            defaultValue: DEFAULT_TYPE,
        },
    ])

    const { api: createProductModal } = useModal('marketplace.createProduct')

    const currentChainId = useCurrentChainId()

    const query = useInfiniteQuery({
        queryKey: ['projects', currentChainId, owner, filter.search, filter.type],
        queryFn({ pageParam: skip }) {
            const { search, type: projectType } = filter

            const params = {
                chainId: currentChainId,
                first: PAGE_SIZE,
                owner,
                projectType,
                skip,
            }

            if (search) {
                return getProjectsByText(search, params)
            }

            return getProjects(params)
        },
        initialPageParam: 0,
        getNextPageParam(lastPage, pages) {
            return lastPage.hasNextPage ? pages.flatMap((p) => p.projects).length : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
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
                    isFetching={query.status === 'pending'}
                    loadProducts={() => void query.fetchNextPage()}
                    hasMoreSearchResults={query.hasNextPage}
                    noOwnProjects={noOwnProjects}
                />
            </ProjectsContainer>
        </Layout>
    )
}
