import { useEffect, useState } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

const useStreamStorageNodeAddresses = (stream) => {
    const [nodes, setNodes] = useState()

    const isMounted = useIsMounted()

    useEffect(() => {
        const fetch = async () => {
            let result = []

            try {
                result = await stream.getStorageNodes()
            } catch (e) {
                console.error('Something is wrong', e)
            }

            if (isMounted()) {
                setNodes(result.map((address) => address.toLowerCase()))
            }
        }

        if (stream) {
            fetch()
        }
    }, [isMounted, stream])

    return nodes
}

export default useStreamStorageNodeAddresses
