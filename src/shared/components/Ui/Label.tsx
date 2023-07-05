import React, { FunctionComponent, HTMLProps, ReactNode } from 'react'
import styled from 'styled-components'
import * as Colors from '~/shared/components/Ui/StateColors'
import { MEDIUM } from '~/shared/utils/styled'

interface Props extends HTMLProps<HTMLLabelElement> {
    keepSpace?: boolean
}

function UnstyledLabel({ children, keepSpace = false, ...props }: Props) {
    return (
        <label {...props}>
            {children}
            {keepSpace ? <>&zwnj;</> : null}
        </label>
    )
}

const Label = styled(UnstyledLabel)<{ state?: string }>`
    color: ${({ state }) =>
        (Colors as { [key: string]: string })[state] || Colors.DEFAULT};
    display: block;
    font-size: 12px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin: 0 0 8px;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition-property: color, transform;
    white-space: nowrap;
`
export default Label
