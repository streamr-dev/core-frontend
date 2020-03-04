// @flow

import styled, { css } from 'styled-components'

const Label = styled.span`
    color: #323232;

    ${({ positive }) => !!positive && css`
        color: #2ac437;
    `}
`

export default Label
