// @flow

import styled from 'styled-components'
import * as Colors from '$ui/StateColors'

const Label = styled.label`
    color: ${({ state }) => Colors[state] || Colors.DEFAULT};
    display: block;
    font-size: 12px;
    font-weight: 500; /* medium */
    line-height: 1em;
    margin: 0 0 8px;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition-property: color, transform;
    white-space: nowrap;
`

export default Label
