import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import {
    GetProjectDocument,
    GetProjectForPurchaseDocument,
    GetProjectForPurchaseQuery,
    GetProjectForPurchaseQueryVariables,
    GetProjectQuery,
    GetProjectQueryVariables,
    GetProjectSubscriptionsDocument,
    GetProjectSubscriptionsQuery,
    GetProjectSubscriptionsQueryVariables,
    GetProjectsByTextDocument,
    GetProjectsByTextQuery,
    GetProjectsByTextQueryVariables,
    GetProjectsDocument,
    GetProjectsQuery,
    GetProjectsQueryVariables,
    Project_Filter,
} from '~/generated/gql/network'
import { TheGraph } from '~/shared/types'
import address0 from '~/utils/address0'
import { GraphProject } from '~/shared/consts'
import { getGraphUrl } from '.'

let apolloClient: undefined | ApolloClient<NormalizedCacheObject>

function getApolloClient() {
    if (!apolloClient) {
        apolloClient = new ApolloClient({
            uri: getGraphUrl(),
            cache: new InMemoryCache(),
        })
    }

    return apolloClient
}

export async function getRawGraphProject(projectId: string) {
    const {
        data: { project },
    } = await getApolloClient().query<GetProjectQuery, GetProjectQueryVariables>({
        query: GetProjectDocument,
        variables: {
            id: projectId,
        },
    })

    return project || null
}

export async function getRawGraphProjects({
    owner,
    first = 20,
    skip = 0,
    projectType,
    streamId,
}: {
    owner?: string | undefined
    first?: number
    skip?: number
    projectType?: TheGraph.ProjectType
    streamId?: string
}) {
    const where: Project_Filter = {}

    if (projectType === TheGraph.ProjectType.Open) {
        where.paymentDetails_ = {
            beneficiary: address0,
        }
    }

    if (projectType === TheGraph.ProjectType.Paid) {
        where.paymentDetails_ = {
            beneficiary_not: address0,
        }
    }

    if (projectType === TheGraph.ProjectType.DataUnion) {
        where.isDataUnion = true
    }

    if (owner) {
        where.permissions_ = {
            userAddress: owner,
            canGrant: true,
        }
    }

    if (streamId) {
        where.streams_contains = [streamId]
    }

    const {
        data: { projects = [] },
    } = await getApolloClient().query<GetProjectsQuery, GetProjectsQueryVariables>({
        query: GetProjectsDocument,
        variables: {
            skip,
            first,
            where,
        },
    })

    return projects
}

export async function getRawGraphProjectsByText(
    value: string,
    { first = 20, skip = 0 }: { first?: number; skip?: number },
) {
    const {
        data: { projectSearch: projects = [] },
    } = await getApolloClient().query<
        GetProjectsByTextQuery,
        GetProjectsByTextQueryVariables
    >({
        query: GetProjectsByTextDocument,
        variables: {
            first,
            skip,
            text: value,
        },
    })

    return projects
}

export async function getProjectSubscriptions(
    projectId: string,
): Promise<TheGraph.ProjectSubscription[]> {
    const {
        data: { project },
    } = await getApolloClient().query<
        GetProjectSubscriptionsQuery,
        GetProjectSubscriptionsQueryVariables
    >({
        query: GetProjectSubscriptionsDocument,
        variables: {
            id: projectId,
        },
    })

    return project?.subscriptions || []
}

export async function getProjectForPurchase(projectId: string) {
    const {
        data: { project },
    } = await getApolloClient().query<
        GetProjectForPurchaseQuery,
        GetProjectForPurchaseQueryVariables
    >({
        query: GetProjectForPurchaseDocument,
        variables: {
            id: projectId,
        },
    })

    if (project) {
        return GraphProject.pick({ paymentDetails: true, streams: true }).parse(project)
    }

    return null
}
