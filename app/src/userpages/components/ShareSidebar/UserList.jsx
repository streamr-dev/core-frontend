import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Sidebar from '$shared/components/Sidebar'
import UserPermissions from './UserPermissions'
import ErrorMessage from './ErrorMessage'
import Pagination from './Pagination'

const UnstyledUserList = ({
    currentUser,
    items,
    onSelect,
    permissions,
    removeUser,
    resourceType,
    selectedUserId,
    updatePermission,
    userErrors,
    ...props
}) => {
    const onClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            // Select none on click background.
            onSelect()
        }
    }, [onSelect])

    const [subitems, setSubitems] = useState(Pagination.subcollection(items, 0))

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
            {...props}
            onClick={onClick}
        >
            {subitems.map(([userId, userPermissions]) => (
                <React.Fragment key={userId}>
                    <Sidebar.Container
                        as={UserPermissions}
                        invalid={!!userErrors[userId]}
                        isCurrentUser={currentUser === userId}
                        isSelected={selectedUserId === userId}
                        onSelect={onSelect}
                        permissions={permissions}
                        removeUser={removeUser}
                        resourceType={resourceType}
                        updatePermission={updatePermission}
                        userId={userId}
                        userPermissions={userPermissions}
                    />
                    {!!userErrors[userId] && (
                        <Sidebar.Container as={ErrorMessage}>
                            {userErrors[userId].message}
                        </Sidebar.Container>
                    )}
                </React.Fragment>
            ))}
            <Pagination collection={items} onPage={setSubitems} onUserSelect={onSelect} selectedUserId={selectedUserId} />
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
