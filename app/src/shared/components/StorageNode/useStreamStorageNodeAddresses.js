import { useEffect, useState } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { get } from '$shared/utils/api'
import routes from '$routes'

const useStreamStorageNodeAddresses = (streamId) => {
    const [nodes, setNodes] = useState()

    const isMounted = useIsMounted()

    useEffect(() => {
        const fetch = async () => {
            let result = []

            try {
                result = await get({
                    url: routes.api.storageNodes.index({
                        id: streamId,
                    }),
                })
            } catch (e) {
                console.error('Something is wrong', e)
            }

            if (isMounted()) {
                setNodes(result.map(({ storageNodeAddress: address }) => address))
            }
        }

        if (streamId) {
            fetch()
        }
    }, [isMounted, streamId])

    return nodes
}

export default useStreamStorageNodeAddresses
