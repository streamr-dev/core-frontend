import React from 'react'
import styled from 'styled-components'
import * as Colors from '$ui/StateColors'
import { MEDIUM } from '$shared/utils/styled'

function UnstyledLabel({ className, children }) {
    return (
        <label className={className}>
            {children}&zwnj;
        </label>
    )
}

const Label = styled(UnstyledLabel)`
    color: ${({ state }) => Colors[state] || Colors.DEFAULT};
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
