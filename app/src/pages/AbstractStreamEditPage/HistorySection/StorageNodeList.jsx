import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import useStreamId from '$shared/hooks/useStreamId'
import Label from '$ui/Label'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import StorageNodeItem from './StorageNodeItem'

function UnstyledStorageNodeList({ className, disabled }) {
    const streamId = useStreamId()

    const [nodeAddresses, setNodeAddresses] = useState({})

    const client = useClient()

    const { current: { storageNodes } } = useRef(getCoreConfig())

    useEffect(() => {
        let aborted = false

        async function fn() {
            try {
                const addresses = await client.getStorageNodesOf(streamId)

                if (aborted) {
                    return
                }

                const result = {}

                storageNodes.forEach(({ address }) => {
                    result[address.toLowerCase()] = false
                })

                addresses.forEach((address) => {
                    result[address.toLowerCase()] = true
                })

                setNodeAddresses(result)
            } catch (e) {
                console.warn(e)
            }
        }

        if (streamId) {
            fn()
        }

        return () => {
            aborted = true
        }
    }, [client, streamId, storageNodes])

    return (
        <div className={className}>
            <Label>
                {disabled ? 'Storage nodes' : 'Choose storage nodes (one or more)'}
            </Label>
            <ul data-test-hook="Storage nodes">
                {storageNodes.map(({ address, name }) => (
                    <li key={address}>
                        <StorageNodeItem
                            address={address}
                            active={nodeAddresses[address.toLowerCase()]}
                            disabled={disabled}
                        >
                            {name}
                        </StorageNodeItem>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const StorageNodes = styled(UnstyledStorageNodeList)`
    margin-bottom: 40px;

    ul {
        list-style: none;
        margin: 0;
        max-width: 536px;
        padding: 0;
    }
`

export default StorageNodes
