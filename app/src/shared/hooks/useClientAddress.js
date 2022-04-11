import { useEffect, useState } from 'react'
import { useClient } from 'streamr-client-react'
import getClientAddress from '$app/src/getters/getClientAddress'

export default function useClientAddress() {
    const client = useClient()

    const [addr, setAddr] = useState()

    useEffect(() => {
        let aborted = false

        async function fn() {
            const user = await getClientAddress(client, {
                suppressFailures: true,
            })

            if (aborted) {
                return
            }

            setAddr(user.toLowerCase())
        }

        fn()

        return () => {
            aborted = true
        }
    }, [client])

    return addr
}
