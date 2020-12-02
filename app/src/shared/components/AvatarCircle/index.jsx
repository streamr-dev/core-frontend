import React from 'react'
import styled from 'styled-components'

import { MD } from '$shared/utils/styled'

const UnstyledAvatarCircle = ({ children, ...props }) => (
    <div {...props}>
        {children}
    </div>
)

const AvatarCircle = styled(UnstyledAvatarCircle)`
    background-color: #EFEFEF;
    border-radius: 50%;
    height: 72px;
    width: 72px;
    position: relative;
    overflow: hidden;

    @media (min-width: ${MD}px) {
        width: 80px;
        height: 80px;
    }
`

export default AvatarCircle
