import { css, createGlobalStyle } from 'styled-components'

const Layout = createGlobalStyle`
    ${({ inspectorWidth: iw }) => css`
        :root {
            --LiveDataInspectorWidth: ${iw}px;
        }
    `}
`

export default Layout
