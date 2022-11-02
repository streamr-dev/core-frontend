import styled, { css } from 'styled-components'
import { TABLET, DESKTOP } from '$shared/utils/styled'

function displayCss(displayValue: boolean | string): string {
    return displayValue === true ? 'block' : displayValue as string
}

const Display = styled.div<{$mobile?: boolean | string, $tablet?: boolean | string, $desktop?: boolean | string}>`
    ${({ $mobile = true }) =>
        $mobile !== true &&
        css`
            display: ${displayCss($mobile)};
        `}

    ${({ $mobile = true, $tablet = $mobile }) =>
        $tablet !== $mobile &&
        css`
            @media ${TABLET} {
                display: ${displayCss($tablet)};
            }
        `}

    ${({ $mobile = true, $tablet = $mobile, $desktop = $tablet }) =>
        ($desktop !== $tablet || ($desktop !== $mobile && $tablet !== $mobile)) &&
        css`
            @media ${DESKTOP} {
                display: ${displayCss($desktop)};
            }
        `}
`
export default Display
