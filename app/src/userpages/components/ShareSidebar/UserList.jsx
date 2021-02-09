import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useEditableUserIds } from '$shared/components/PermissionsProvider'
import Share from './Share'

const UnstyledUserList = ({ items, userErrors, ...props }) => {
    const [selectedUserId, setSelectedUserId] = useState()

    const editableUserIds = useEditableUserIds()

    const onClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            // Select none on click background.
            setSelectedUserId()
        }
    }, [])

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
            {...props}
            onClick={onClick}
        >
            {editableUserIds.map((userId) => (
                <Share
                    key={userId}
                    onSelect={setSelectedUserId}
                    selected={selectedUserId === userId}
                    userId={userId}
                />
            ))}
        </div>
    )
}

const UserList = styled(UnstyledUserList)`
    border-top: 1px solid #efefef;
    flex-grow: 1;
    overflow: auto;

    /* Collapse footer's border-top and UserList item's border-bottom. */
    margin-bottom: -1px;
`

export default UserList
