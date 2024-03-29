import React, { HTMLProps } from 'react'
import styled, { css } from 'styled-components'
import * as Colors from '~/shared/components/Ui/StateColors'
import { MEDIUM } from '~/shared/utils/styled'

function UnstyledLabel({ children, ...props }: HTMLProps<HTMLLabelElement>) {
    return <label {...props}>{children}</label>
}

const Label = styled(UnstyledLabel)<{ state?: string; $wrap?: boolean }>`
    color: ${({ state }) =>
        (state ? (Colors as { [key: string]: string })[state] : undefined) ||
        Colors.DEFAULT};
    display: block;
    font-size: 12px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin: 0 0 8px;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition-property: color, transform;

    ${({ $wrap = false }) =>
        !$wrap &&
        css`
            white-space: nowrap;
        `}
`

export default Label
