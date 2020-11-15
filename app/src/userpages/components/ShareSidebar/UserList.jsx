import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Sidebar from '$shared/components/Sidebar'
import ErrorMessage from './ErrorMessage'
import Share from './Share'
import { useEditableUserIds } from '$shared/components/PermissionsProvider'

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
                <React.Fragment key={userId}>
                    <Sidebar.Container
                        as={Share}
                        selected={selectedUserId === userId}
                        onSelect={setSelectedUserId}
                        userId={userId}
                    />
                    {/* <Sidebar.Container
                        as={UserPermissions}
                        invalid={!!userErrors[userId]}
                        isSelected={selectedUserId === userId}
                        onSelect={onSelect}
                        permissions={permissions}
                        removeUser={removeUser}
                        resourceType={resourceType}
                        updatePermission={updatePermission}
                        userId={userId}
                        userPermissions={userPermissions}
                    /> */}
                    {!!userErrors[userId] && (
                        <Sidebar.Container as={ErrorMessage}>
                            {userErrors[userId].message}
                        </Sidebar.Container>
                    )}
                </React.Fragment>
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
