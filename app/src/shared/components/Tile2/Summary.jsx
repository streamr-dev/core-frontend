// @flow

import React from 'react'
import styled from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'

const Name = styled.div`
`

const Secondary = styled.div`
    font-size: 12px;
`

const UpdatedAt = styled(Secondary)`
    color: #a3a3a3;
`

const Label = styled(Secondary)`
`

const Root = styled.div`
    color: #323232;
    font-size: 16px;
    font-weight: ${MEDIUM};
    line-height: 20px;
    padding-top: 8px;
`

const Summary = ({ name, updatedAt, label, ...props }: Props) => (
    <Root {...props}>
        <Name>{name}</Name>
        <UpdatedAt>{updatedAt}</UpdatedAt>
        <Label>{label}</Label>
    </Root>
)

export default Summary
