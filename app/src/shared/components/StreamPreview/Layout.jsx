import styled, { css, createGlobalStyle } from 'styled-components'
import { LG } from '$shared/utils/styled'

const Layout = createGlobalStyle`
    ${({ inspectorWidth }) => css`
        :root {
            --LiveDataInspectorWidth: ${inspectorWidth || 504}px;
        }
    `}

    @media (min-width: ${LG}px) {
        :root {
            --LiveDataMinLhsWidth: 332px;
        }
    }
`

const Pusher = styled.div`
    min-width: 92px;
    max-width: calc((100vw - 504px - 1108px - 32px) / 2);
    width: calc((100vw - 1108px - var(--LiveDataInspectorWidth) - 32px) / 2);
`

Object.assign(Layout, {
    Pusher,
})

export default Layout
