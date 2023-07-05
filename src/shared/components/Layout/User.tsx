import React from 'react'
import styled from 'styled-components'
import { truncate } from '~/shared/utils/text'
import { MEDIUM } from '~/shared/utils/styled'
export const Name = styled.div`
    font-weight: ${MEDIUM};
    line-height: 1em;
`
export const Username = styled.div`
    color: #a3a3a3;
    line-height: 1em;
`

const UnstyledAvatarless = ({ source, ...props }) => (
    <div {...props}>
        <Username title={source}>
            {truncate(source)}
            &zwnj;
        </Username>
    </div>
)

export const Avatarless = styled(UnstyledAvatarless)``
