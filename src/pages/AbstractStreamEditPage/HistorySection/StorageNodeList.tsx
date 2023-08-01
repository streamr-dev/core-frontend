import React, { useRef } from 'react'
import styled from 'styled-components'
import Label from '~/shared/components/Ui/Label'
import getCoreConfig from '~/getters/getCoreConfig'
import StorageNodeItem from './StorageNodeItem'

type Props = {
    className?: string
    disabled?: boolean
}

function UnstyledStorageNodeList({ className, disabled = false }: Props) {
    const {
        current: { storageNodes: storageNodes },
    } = useRef(getCoreConfig())

    return (
        <div className={className}>
            <Label>
                {disabled ? 'Storage nodes' : 'Choose storage nodes (one or more)'}
            </Label>
            <ul data-test-hook="Storage nodes">
                {storageNodes.map(({ address, name }) => (
                    <li key={address}>
                        <StorageNodeItem address={address} disabled={disabled}>
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
