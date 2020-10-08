import { useEffect, useState } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

const useStreamStorageNodeAddresses = () => {
    const [nodes, setNodes] = useState()

    const isMounted = useIsMounted()

    useEffect(() => {
        const apply = async () => {
            let result = []

            try {
                result = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            {
                                address: '0x0',
                            },
                            {
                                address: '0x3',
                            },
                        ])
                    }, 3000)
                })
            } catch (e) {
                console.error('Something is wrong', e)
            }

            if (isMounted()) {
                setNodes(result.map(({ address }) => address))
            }
        }

        apply()
    }, [isMounted])

    return nodes
}

export default useStreamStorageNodeAddresses
