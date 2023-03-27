import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import useStreamId from '$shared/hooks/useStreamId'
import Label from '$ui/Label'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { useStreamEditorStore } from '../state'
import StorageNodeItem from './StorageNodeItem'

type Props = {
    className?: string,
    disabled?: boolean,
}

function UnstyledStorageNodeList({ className, disabled }: Props) {
    const streamId = useStreamId()
    const [nodeAddresses, setNodeAddresses] = useState({})
    const loadStreamStorageNodes = useStreamEditorStore((state) => state.loadStreamStorageNodes)
    const client = useClient()
    const { current: { storageNodes } } = useRef(getCoreConfig())

    useEffect(() => {
        let aborted = false

        async function fn() {
            try {
                const streamNodes = await loadStreamStorageNodes(streamId, client)

                if (aborted) {
                    return
                }

                const result = {}
                storageNodes.forEach(({ address }) => {
                    result[address.toLowerCase()] = false
                })
                streamNodes.forEach((address) => {
                    result[address.toLowerCase()] = true
                })
                setNodeAddresses(result)
            } catch (e) {
                console.warn(e)
            }
        }

        fn()

        return () => {
            aborted = true
        }
    }, [client, streamId, storageNodes, loadStreamStorageNodes])

    return (
        <div className={className}>
            <Label>{disabled ? 'Storage nodes' : 'Choose storage nodes (one or more)'}</Label>
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
        padding: 0;
    }
`
export default StorageNodes
