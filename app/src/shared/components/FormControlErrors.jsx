// @flow

import React, { type Node, Fragment } from 'react'
import styled from 'styled-components'
import { ERROR } from '$shared/components/FormControlStateColors'

type Props = {
    children?: Node,
}

export const MarketplaceTheme = {
    color: '#ff5c00',
}

const DefaultTheme = {
    color: ERROR,
}

const UnstyledFormControlErrors = ({ children, ...props }: Props) => (
    <div {...props}>
        {children || <Fragment>&zwnj;</Fragment>}
    </div>
)

const FormControlErrors = styled(UnstyledFormControlErrors)`
    color: ${({ theme }) => theme.color};
    font-size: 12px;
    line-height: 1.5em;
    margin-top: 6px;
`

FormControlErrors.defaultProps = {
    theme: DefaultTheme,
}

export default FormControlErrors
