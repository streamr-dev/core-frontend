// @flow

import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import AvatarCircle from '$shared/components/AvatarCircle'
import AvatarImage from '$shared/components/AvatarImage'

import routes from '$routes'
import NameAndUsername from './NameAndUsername'

const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`

const UnstyledAvatar = ({ user, linkToProfile, children, ...props }) => (
    <div {...props}>
        {!!linkToProfile && (
            <StyledLink to={routes.profile()}>
                <AvatarCircle>
                    <AvatarImage
                        src={user.imageUrlLarge}
                        username={user.username}
                    />
                </AvatarCircle>
            </StyledLink>
        )}
        {!linkToProfile && (
            <AvatarCircle>
                <AvatarImage
                    src={user.imageUrlLarge}
                    username={user.username}
                />
            </AvatarCircle>
        )}
        <NameAndUsername name={user.name}>
            {children}
        </NameAndUsername>
    </div>
)

const Avatar = styled(UnstyledAvatar)`
    display: flex;

    ${AvatarCircle} {
        margin-right: 1.5rem;
    }
`

export default Avatar
