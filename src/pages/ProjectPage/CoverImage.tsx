import React from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

export default function CoverImage() {
    return <Root />
}

export const Root = styled.div`
    aspect-ratio: 1 / 1;
    background-color: ${COLORS.primaryLight};
    border-radius: 16px;
    max-width: 100%;
    width: 400px;
`
