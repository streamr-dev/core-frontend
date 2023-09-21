import styled, { css } from 'styled-components'
import { TABLET, DESKTOP } from '~/shared/utils/styled'

const ColoredBox = styled.div<{
    $backgroundColor?: string
    $pad?: boolean
    $borderColor?: string
}>`
    background-color: ${({ $backgroundColor = '#ffffff' }) => $backgroundColor};
    border-radius: 16px;

    ${({ $borderColor }) =>
        typeof $borderColor === 'string' &&
        css`
            border: 1px solid ${$borderColor};
        `}

    ${({ $pad = false }) =>
        $pad &&
        css`
            padding: 24px;

            @media ${TABLET} {
                padding: 40px;
            }

            @media ${DESKTOP} {
                padding: 52px;
            }
        `}
`

export default ColoredBox
