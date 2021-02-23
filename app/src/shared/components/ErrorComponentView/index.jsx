import React from 'react'
import styled from 'styled-components'

const UnstyledErrorComponentView = (props) => (
    <div {...props}>
        Oops. Something has broken down here.
    </div>
)

const ErrorComponentView = styled(UnstyledErrorComponentView)`
    align-items: center;
    align-self: center;
    color: #323232;
    display: flex;
    flex: 1;
    font-size: 1em;
    justify-content: center;
    line-height: 1.5em;
    max-width: 800px;
    padding: 30px;
    text-align: center;
`

export default ErrorComponentView
