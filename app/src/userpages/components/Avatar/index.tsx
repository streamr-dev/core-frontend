import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AvatarCircle from '$shared/components/AvatarCircle'
import AvatarImage from '$shared/components/AvatarImage'
import NameAndUsername from './NameAndUsername'

const UnstyledAvatar = ({ user, linkToProfile, children, ...props }) => (
    <div {...props}>
        {!!linkToProfile && (
            <AvatarCircle>
                <AvatarImage src={user.imageUrlLarge} username={user.username} />
            </AvatarCircle>
        )}
        {!linkToProfile && (
            <AvatarCircle>
                <AvatarImage src={user.imageUrlLarge} username={user.username} />
            </AvatarCircle>
        )}
        <NameAndUsername name={user.name}>{children}</NameAndUsername>
    </div>
)

const Avatar = styled(UnstyledAvatar)`
    display: flex;

    ${AvatarCircle} {
        margin-right: 1.5rem;
    }
`
export default Avatar
