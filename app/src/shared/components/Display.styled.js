import styled, { css } from 'styled-components'
import { TABLET, DESKTOP } from '$shared/utils/styled'

function displayCss(displayValue) {
    return displayValue === true ? 'block' : displayValue
}

const Display = styled.div`
    ${({ $mobile = true }) => $mobile !== true && css`
        display: ${displayCss($mobile)};
    `}

    ${({ $mobile = true, $tablet = $mobile }) => $tablet !== $mobile && css`
        @media ${TABLET} {
            display: ${displayCss($tablet)};
        }
    `}

    ${({ $mobile = true, $tablet = $mobile, $desktop = $tablet }) => (
        ($desktop !== $tablet || ($desktop !== $mobile && $tablet !== $mobile)) && css`
            @media ${DESKTOP} {
                display: ${displayCss($desktop)};
            }
        `
    )}
`

export default Display
