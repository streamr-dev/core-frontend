// @flow

import React from 'react'
import styled from 'styled-components'

type Props = {
    value: number,
}

const ProgressBackground = styled.div`
    width: 100%;
    height: 2px;
    background-color: #E7E7E7;
`

const ProgressIndicator = styled.div`
    width: ${({ value }) => Math.ceil(Math.min(100, Math.max(0, value)))}%;
    height: 2px;
    background-color: #0324FF;
    transition: width 0.3s ease;
`

const ProgressBar = ({ value }: Props) => (
    <ProgressBackground>
        <ProgressIndicator value={value} />
    </ProgressBackground>
)

export default ProgressBar
