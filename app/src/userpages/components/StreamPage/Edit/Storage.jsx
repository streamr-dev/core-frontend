import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import StorageNode from '$shared/components/StorageNode'
import Label from '$ui/Label'

const useStorageNodes = () => [
    [true, 'Switzerland'],
    [true, 'United States of America'],
    [false, 'Canada'],
    [false, 'United Kingdom'],
    [false, 'Singapore'],
]

const UnstyledStorage = ({ streamId, ...props }) => {
    const storageNodes = useStorageNodes(streamId)

    return (
        <div {...props}>
            <Label>
                {I18n.t('userpages.streams.edit.storageNodes.label')}
            </Label>
            <StorageNode.List>
                {storageNodes.map(([enabled, name]) => (
                    <StorageNode key={name} checked={enabled}>
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
