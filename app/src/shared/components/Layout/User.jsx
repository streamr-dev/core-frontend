import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'
import { MEDIUM } from '$shared/utils/styled'
import useCopy from '$shared/hooks/useCopy'
import Tooltip from '$shared/components/Tooltip'

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
        <Name title={source.name}>
            {source.name}
            &zwnj;
        </Name>
        <Username title={source.username}>
            {isEthereumAddress(source.username) ? (
                truncate(source.username, {
                    maxLength: 14,
                })
            ) : (
                source.username
            )}
            &zwnj;
        </Username>
    </div>
)

const Avatarless = styled(UnstyledAvatarless)``

const UsernameButton = styled.button`
    background-color: #F8F8F8;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    font-family: var(--medium);
    font-weight: var(--medium);
    font-size: 12px;
    text-align: center;
    color: #323232;
    padding: 0 8px;
    border: 0;
    appearance: none;
    outline: none;
    width: 112px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    :hover {
        background-color: #EFEFEF;
    }

    :active,
    :focus {
        background-color: #E7E7E7;
        outline: none;
    }
`

const UnstyledUsernameCopy = ({ children, username, ...props }) => {
    const { copy, isCopied } = useCopy()
    const isAddress = isEthereumAddress(username)
    const copyText = isAddress ? I18n.t('general.copyAddress') : I18n.t('general.copyUsername')
    const copiedText = I18n.t('general.copied')

    return (
        <div {...props}>
            <Tooltip value={isCopied ? copiedText : copyText} placement={Tooltip.BOTTOM}>
                <UsernameButton
                    type="button"
                    onClick={() => copy(username)}
                >
                    {isAddress ? (
                        truncate(username, {
                            maxLength: 14,
                        })
                    ) : (
                        username
                    )}
                    &zwnj;
                </UsernameButton>
            </Tooltip>
        </div>
    )
}

const UsernameCopy = styled(UnstyledUsernameCopy)`
`

const UnstyledUser = ({ source = EmptyUser, ...props }) => (
    <div {...props}>
        <UsernameCopy username={source.username} />
    </div>
)

const User = styled(UnstyledUser)`
    display: flex;
    justify-content: flex-end;
`

Object.assign(User, {
    Avatarless,
    Name,
    Username,
    UsernameCopy,
})

export default User
