import React from 'react'
import styled, { css } from 'styled-components'
import { COLORS, DESKTOP, TABLET } from '~/shared/utils/styled'

export const WhiteBoxPaddingStyles = css`
    padding: 24px;
    @media (${TABLET}) {
        padding: 40px;
    }
    @media (${DESKTOP}) {
        //padding: 52px;
    }
`

export const WhiteBox = styled.div`
    background-color: white;
    border-radius: 16px;
    &.with-padding {
        ${WhiteBoxPaddingStyles}
    }
`

export const WhiteBoxSeparator = styled.hr`
    border: none;
    width: 100%;
    height: 1px;
    background-color: ${COLORS.separator};
    margin: 0;
`
