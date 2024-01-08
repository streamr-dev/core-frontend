import { ComponentProps } from 'react'
import styled from 'styled-components'

function getAdvancedLabelProps(): ComponentProps<'div'> {
    return { children: 'Advanced' }
}

export const Advanced = styled.div.attrs(getAdvancedLabelProps)`
    background-color: #a3a3a3;
    color: #fff;
    font-size: 0.75rem;
    line-height: 0.75rem;
    font-weight: var(--medium);
    letter-spacing: 0;
    border-radius: 2px;
    padding: 0.375rem 0.5rem;
    text-align: center;
`
