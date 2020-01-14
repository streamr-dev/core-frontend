// @flow

import styled from 'styled-components'

const FormControlLabel = styled.label`
    color: #323232;
    font-size: 12px;
    font-weight: 500; /* medium */
    left: 0;
    line-height: 20px;
    margin: 0;
    overflow: visible;
    position: absolute;
    top: -24px;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition-property: color, transform;
    white-space: nowrap;
    width: 100%;
    z-index: 1;
`

export default FormControlLabel
