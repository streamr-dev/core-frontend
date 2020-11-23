// @flow

import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import NameAndUsername from './NameAndUsername'
import AvatarCircle from '$shared/components/AvatarCircle'
import { MD } from '$shared/utils/styled'

import routes from '$routes'

const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`

const StyledAvatarCircle = styled(AvatarCircle)`
  && {
    margin-right: 1.5rem;
    width: 72px;
    height: 72px;
    line-height: 5rem;
    font-size: 2em;
    overflow: hidden;

    @media (min-width: ${MD}px) {
        width: 80px;
        height: 80px;
    }
  }
`

const UnstyledAvatar = ({ user, linkToProfile, children, ...props }) => (
    <div {...props}>
        {!!linkToProfile && (
            <StyledLink to={routes.profile()}>
                <StyledAvatarCircle name={user.name} imageUrl={user.imageUrlLarge} />
            </StyledLink>
        )}
        {!linkToProfile && (
            <StyledAvatarCircle name={user.name} imageUrl={user.imageUrlLarge} uploadAvatarPlaceholder />
        )}
        <NameAndUsername name={user.name}>
            {children}
        </NameAndUsername>
    </div>
)

const Avatar = styled(UnstyledAvatar)`
  display: flex;
`

export default Avatar
