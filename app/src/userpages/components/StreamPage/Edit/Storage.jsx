import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import StorageNode from '$shared/components/StorageNode'
import Label from '$ui/Label'
import nodes from '$shared/components/StorageNode/nodes'
import useStreamStorageNodeAddresses from '$shared/components/StorageNode/useStreamStorageNodeAddresses'

const UnstyledStorage = ({ streamId, ...props }) => {
    const addresses = useStreamStorageNodeAddresses(streamId)

    return (
        <div {...props}>
            <Label>
                {I18n.t('userpages.streams.edit.storageNodes.label')}
            </Label>
            <StorageNode.List>
                {nodes.map(({ address, name }) => (
                    <StorageNode
                        address={address}
                        checked={(addresses || []).includes(address)}
                        changing={addresses == null}
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
    margin-bottom: 48px;
`

export default Storage
