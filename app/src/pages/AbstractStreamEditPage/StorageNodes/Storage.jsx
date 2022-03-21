import React from 'react'
import styled from 'styled-components'
import Label from '$ui/Label'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import useStreamStorageNodeAddresses from './useStreamStorageNodeAddresses'
import useStreamStorageNodeToggle from './useStreamStorageNodeToggle'
import StorageNode from './StorageNode'

const StorageNodeItem = ({
    stream,
    address,
    name,
    disabled,
    checked: checkedProp,
    changing: changingProp,
}) => {
    const [checked, changing, change] = useStreamStorageNodeToggle(stream, address, checkedProp, changingProp)

    return (
        <StorageNode
            address={address}
            changing={changing}
            checked={checked}
            disabled={disabled}
            onClick={change}
        >
            {name}
        </StorageNode>
    )
}

const UnstyledStorage = ({ stream, disabled, ...props }) => {
    const addresses = useStreamStorageNodeAddresses(stream)

    const { storageNodes } = getCoreConfig()

    return (
        <div {...props}>
            <Label>
                {!disabled && 'Choose storage nodes (one or more)'}
                {!!disabled && 'Storage nodes'}
            </Label>
            <StorageNode.List data-test-hook="Storage nodes">
                {storageNodes.map(({ address, name }) => (
                    <StorageNodeItem
                        address={address}
                        name={name}
                        changing={addresses == null}
                        checked={(addresses || []).includes(address.toLowerCase())}
                        disabled={disabled}
                        key={address}
                        stream={stream}
                    />
                ))}
            </StorageNode.List>
        </div>
    )
}

const Storage = styled(UnstyledStorage)`
    margin-bottom: 40px;
`

export default Storage
