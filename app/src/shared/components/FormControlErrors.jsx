// @flow

import React, { type Node, Fragment } from 'react'
import styled from 'styled-components'
import { ERROR } from '$shared/components/FormControlStateColors'

type Props = {
    children?: Node,
}

const UnstyledFormControlErrors = ({ children, ...props }: Props) => (
    <div {...props}>
        {children || <Fragment>&zwnj;</Fragment>}
    </div>
)

const FormControlErrors = styled(UnstyledFormControlErrors)`
    color: ${ERROR};
    font-size: 12px;
    line-height: 1.5em;
    margin-top: 6px;
`

export default FormControlErrors
