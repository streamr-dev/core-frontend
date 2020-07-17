import React from 'react'
import styled from 'styled-components'
import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'
import { MEDIUM } from '$shared/utils/styled'

const Name = styled.div`
    font-size: 14px;
    font-weight: ${MEDIUM};
`

const Username = styled.div`
    color: #a3a3a3;
    font-size: 12px;
`

const UnstyledUser = ({ source, ...props }) => (
    <div {...props}>
        <Name>
            {source.name}
        </Name>
        <Username>
            {isEthereumAddress(source.username) ? (
                truncate(source.username, {
                    maxLength: 20,
                })
            ) : (
                source.username
            )}
        </Username>
    </div>
)

const User = styled(UnstyledUser)`
    line-height: 20px;
`

Object.assign(User, {
    Name,
    Username,
})

export default User
