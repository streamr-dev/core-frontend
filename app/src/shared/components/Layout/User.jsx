import React from 'react'
import styled from 'styled-components'
import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'
import { MEDIUM, MD as TABLET } from '$shared/utils/styled'
import Avatar from '$shared/components/Avatar'

const Name = styled.div`
    font-weight: ${MEDIUM};
    line-height: 1em;
`

const Username = styled.div`
    color: #a3a3a3;
    line-height: 1em;
`

const EmptyUser = {
    imageUrlSmall: undefined,
    name: '',
    username: '',
}

const UnstyledAvatarless = ({ source = EmptyUser, ...props }) => (
    <div {...props}>
        <Name>
            {source.name}
            &zwnj;
        </Name>
        <Username>
            {isEthereumAddress(source.username) ? (
                truncate(source.username, {
                    maxLength: 20,
                })
            ) : (
                source.username
            )}
            &zwnj;
        </Username>
    </div>
)

const Avatarless = styled(UnstyledAvatarless)``

const UnstyledUser = ({ source = EmptyUser, ...props }) => (
    <div {...props}>
        <Avatar
            alt={source.name}
            src={source.imageUrlSmall}
            css={typeof source.imageUrlSmall === 'undefined' && `
                visibility: hidden;
            `}
        />
        <Avatarless
            source={source}
        />
    </div>
)

const User = styled(UnstyledUser)`
    align-items: center;
    display: flex;

    ${Avatar} {
        border-radius: 50%;
        flex: 0 0 40px;
        overflow: hidden;
    }

    ${Avatarless} {
        flex-grow: 1;
        margin-left: 16px;
    }

    @media (min-width: ${TABLET}px) {
        ${Avatar} {
            flex-basis: 80px;
        }

        ${Avatarless} {
            margin-left: 40px;
        }
    }
`

Object.assign(User, {
    Avatarless,
    Name,
    Username,
})

export default User
