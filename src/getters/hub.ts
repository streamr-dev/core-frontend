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
import { address0 } from '~/consts'
import { ProjectParser } from '~/parsers/ProjectParser'
import { getGraphClient } from '~/getters/getGraphClient'

export async function getParsedProjectById(projectId: string, { force = false } = {}) {
    const {
        data: { project },
    } = await getGraphClient().query<GetProjectQuery, GetProjectQueryVariables>({
        query: GetProjectDocument,
        variables: {
            id: projectId,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return (project || null) && (await ProjectParser.parseAsync(project))
}

export async function getRawGraphProjects({
    owner,
    first = 20,
    skip = 0,
    projectType,
    streamId,
    force = false,
}: {
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
    } = await getGraphClient().query<GetProjectsQuery, GetProjectsQueryVariables>({
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
    value: string,
    {
        first = 20,
        skip = 0,
        force = false,
    }: { first?: number; skip?: number; force?: boolean },
): Promise<GetProjectsByTextQuery['projectSearch']> {
    const {
        data: { projectSearch: projects = [] },
    } = await getGraphClient().query<
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
    projectId: string,
    { force = false } = {},
): Promise<TheGraph.ProjectSubscription[]> {
    const {
        data: { project },
    } = await getGraphClient().query<
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
