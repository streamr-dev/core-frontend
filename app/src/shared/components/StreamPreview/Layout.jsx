import styled, { css, createGlobalStyle } from 'styled-components'
import { LG } from '$shared/utils/styled'

const Layout = createGlobalStyle`
    ${({ inspectorWidth: iw }) => css`
        :root {
            --LiveDataInspectorWidth: ${iw}px;
        }
    `}

    @media (min-width: ${LG}px) {
        :root {
            --LiveDataMinLhsWidth: 332px;
        }
    }
`

const Pusher = styled.div`
    min-width: ${({ minWidth }) => minWidth}px;
    width: calc((100vw - 1108px - var(--LiveDataInspectorWidth, 504px)) / 2 - (${({ minWidth }) => 108 - minWidth}px));
`

Pusher.defaultProps = {
    minWidth: 108,
}

Object.assign(Layout, {
    Pusher,
})

export default Layout
