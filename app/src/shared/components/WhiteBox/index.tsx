import React from 'react'
import styled from 'styled-components'
import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'

export const WhiteBox = styled.div`
    background-color: white;
    border-radius: 16px;
    &.with-padding {
        padding: 24px;
        @media (${TABLET}) {
            padding: 40px;
        }
        @media (${DESKTOP}) {
            padding: 52px;
        }
    }
`

export const WhiteBoxSeparator = styled.hr`
    border: none;
    width: 100%;
    height: 1px;
    background-color: ${COLORS.separator};
`
