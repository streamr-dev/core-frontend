import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import StorageNode from '$shared/components/StorageNode'
import Label from '$ui/Label'
import nodes from '$shared/utils/storageNodes'
import useStreamStorageNodeAddresses from '$shared/components/StorageNode/useStreamStorageNodeAddresses'

const UnstyledStorage = ({ streamId, disabled, ...props }) => {
    const addresses = useStreamStorageNodeAddresses(streamId)

    return (
        <div {...props}>
            <Label>
                {I18n.t(`userpages.streams.${disabled ? 'view' : 'edit'}.storageNodes.label`)}
            </Label>
            <StorageNode.List data-test-hook="Storage nodes">
                {nodes.map(({ address, name }) => (
                    <StorageNode
                        address={address}
                        changing={addresses == null}
                        checked={(addresses || []).includes(address)}
                        disabled={disabled}
                        key={address}
                        streamId={streamId}
                    >
                        {name}
                    </StorageNode>
                ))}
            </StorageNode.List>
        </div>
    )
}

const Storage = styled(UnstyledStorage)`
    margin-bottom: 40px;
`

export default Storage
