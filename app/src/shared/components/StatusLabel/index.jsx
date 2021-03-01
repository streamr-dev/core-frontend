import React from 'react'
import styled from 'styled-components'

export const DarkGrayTheme = {
    background: '#323232',
    color: 'white',
}

export const LightGrayTheme = {
    background: '#A3A3A3',
    color: 'white',
}

const Label = styled.div`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-size: 0.75rem;
    line-height: 0.75rem;
    font-weight: var(--medium);
    letter-spacing: 0;
    border-radius: 2px;
    padding: 0.375rem 0.5rem;
    min-width: 80px;
    text-align: center;
`

export const Deprecated = () => (
    <Label theme={DarkGrayTheme}>Deprecated</Label>
)

export const Advanced = () => (
    <Label theme={LightGrayTheme}>Advanced</Label>
)

Label.Deprecated = Deprecated
Label.Advanced = Advanced

export default Label
