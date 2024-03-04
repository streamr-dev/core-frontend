import {
    GetProjectDocument,
    GetProjectQuery,
    GetProjectQueryVariables,
    GetProjectSubscriptionsDocument,
    GetProjectSubscriptionsQuery,
    GetProjectSubscriptionsQueryVariables,
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
