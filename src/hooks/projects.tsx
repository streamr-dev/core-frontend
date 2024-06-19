import { useQuery } from '@tanstack/react-query'
import { getParsedProjectById } from '~/getters/hub'
import { useCurrentChainId } from '~/utils/chains'
import { useRequestedBlockNumber } from '.'

export function useProjectByIdQuery(projectId: string | undefined) {
    const chainId = useCurrentChainId()

    const minBlockNumber = useRequestedBlockNumber()

    return useQuery({
        queryKey: [
            'useProjectByIdQuery',
            chainId,
            projectId?.toLowerCase(),
            minBlockNumber,
        ],
        queryFn: async () => {
            if (!projectId) {
                return null
            }

            const result = await getParsedProjectById(chainId, projectId, {
                force: true,
                minBlockNumber,
            })

            if (!result) {
                throw new Error('Project could not be found or is invalid')
            }

            return result
        },
        staleTime: Infinity,
        cacheTime: 0,
        retry: false,
    })
}
