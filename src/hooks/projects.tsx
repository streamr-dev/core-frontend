import { useQuery } from '@tanstack/react-query'
import {
    GetProjectDocument,
    GetProjectQuery,
    GetProjectQueryVariables,
} from '~/generated/gql/network'
import { getGraphClient } from '~/getters/getGraphClient'
import { parseProject } from '~/parsers/ProjectParser'
import { useCurrentChainId } from '~/shared/stores/chain'

export async function getProjectByIdQuery(chainId: number, projectId: string) {
    const {
        data: { project: graphProject },
    } = await getGraphClient(chainId).query<GetProjectQuery, GetProjectQueryVariables>({
        query: GetProjectDocument,
        variables: {
            id: projectId.toLowerCase(),
        },
        fetchPolicy: 'network-only',
    })

    if (!graphProject) {
        throw new Error('Not found or invalid')
    }

    return parseProject(graphProject, { chainId })
}

export function useGetProjectByIdQuery(projectId: string | undefined) {
    const chainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useGetProjectByIdQuery', chainId, projectId?.toLowerCase()],
        queryFn: () => {
            return projectId
                ? getProjectByIdQuery(chainId, projectId)
                : Promise.resolve(null)
        },
        staleTime: Infinity,
    })
}
