import {
    GetProjectDocument,
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
import { parseProject } from '~/parsers/ProjectParser'
import { getGraphClient } from '~/getters/getGraphClient'
import { prehandleBehindBlockError } from '~/errors/BehindIndexError'

export async function getParsedProjectById(
    chainId: number,
    projectId: string,
    { force = false, minBlockNumber = 0 } = {},
) {
    try {
        const {
            data: { project },
        } = await getGraphClient(chainId).query<
            GetProjectQuery,
            GetProjectQueryVariables
        >({
            query: GetProjectDocument,
            variables: {
                id: projectId.toLowerCase(),
                minBlockNumber,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        return (project || null) && (await parseProject(project, { chainId }))
    } catch (e) {
        prehandleBehindBlockError(e, minBlockNumber)

        throw e
    }
}

export async function getRawGraphProjects({
    chainId,
    owner,
    first = 20,
    skip = 0,
    projectType,
    streamId,
    force = false,
}: {
    chainId: number
    owner?: string | undefined
    first?: number
    skip?: number
    projectType?: TheGraph.ProjectType
    streamId?: string
    force?: boolean
}): Promise<GetProjectsQuery['projects']> {
    const where: Project_Filter = {}

    if (projectType === TheGraph.ProjectType.Open) {
        where.paymentDetails_ = {
            pricePerSecond: 0,
        }
    }

    if (projectType === TheGraph.ProjectType.Paid) {
        where.paymentDetails_ = {
            pricePerSecond_gt: 0,
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
    } = await getGraphClient(chainId).query<GetProjectsQuery, GetProjectsQueryVariables>({
        query: GetProjectsDocument,
        variables: {
            skip,
            first,
            where,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return projects
}

export async function getRawGraphProjectsByText(
    chainId: number,
    value: string,
    {
        first = 20,
        skip = 0,
        force = false,
    }: { first?: number; skip?: number; force?: boolean },
): Promise<GetProjectsByTextQuery['projectSearch']> {
    const {
        data: { projectSearch: projects = [] },
    } = await getGraphClient(chainId).query<
        GetProjectsByTextQuery,
        GetProjectsByTextQueryVariables
    >({
        query: GetProjectsByTextDocument,
        variables: {
            first,
            skip,
            text: value,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return projects
}

export async function getProjectSubscriptions(
    chainId: number,
    projectId: string,
    { force = false } = {},
): Promise<TheGraph.ProjectSubscription[]> {
    const {
        data: { project },
    } = await getGraphClient(chainId).query<
        GetProjectSubscriptionsQuery,
        GetProjectSubscriptionsQueryVariables
    >({
        query: GetProjectSubscriptionsDocument,
        variables: {
            id: projectId,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return project?.subscriptions || []
}
