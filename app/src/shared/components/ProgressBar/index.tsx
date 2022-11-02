import React from 'react'
import styled from 'styled-components'
type Props = {
    value: number
}
const ProgressBackground = styled.div`
    width: 100%;
    height: 2px;
    background-color: #e7e7e7;
`
const ProgressIndicator = styled.div`
    height: 2px;
    background-color: #0324ff;
    transition: width 0.3s ease;
`

const ProgressBar = ({ value }: Props) => (
    <ProgressBackground>
        <ProgressIndicator
            style={{
                width: `${Math.ceil(Math.min(100, Math.max(0, value)))}%`,
            }}
        />
    </ProgressBackground>
)

export default ProgressBar
