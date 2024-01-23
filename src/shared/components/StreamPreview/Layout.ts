import styled, { css, createGlobalStyle } from 'styled-components'
import { MD, XL, PHONE } from '~/shared/utils/styled'

type Props = {
    inspectorWidth: number
}

const Layout = createGlobalStyle<Props>`
    :root {
        --LiveDataInspectorMinWidth: 375px;
        --LiveDataMinLhsWidth: 248px;
        --LiveDataMinMargin: 8px;
        --LiveDataTimestampColumnMaxWidth: 224px;
    }

    @media ${PHONE} {
        :root {
            --LiveDataInspectorMinWidth: 375px;
            --LiveDataMinLhsWidth: 248px;
            --LiveDataMinMargin: 8px;
            --LiveDataTimestampColumnMaxWidth: 224px;
        }
    }

    @media (min-width: ${MD}px) {
        :root {
            --LiveDataInspectorMinWidth: 488px;
            --LiveDataMinLhsWidth: 264px;
            --LiveDataMinMargin: 24px;
            --LiveDataTimestampColumnMaxWidth: 224px;
        }
    }

    @media (min-width: ${XL}px) {
        :root {
            --LiveDataInspectorMinWidth: 488px;
            --LiveDataMinLhsWidth: 332px;
            --LiveDataMinMargin: 92px;
            --LiveDataTimestampColumnMaxWidth: 224px;
        }
    }

    ${({ inspectorWidth }) => css`
        :root {
            --LiveDataInspectorWidth: 100vw;
        }

        @media ${PHONE} {
            :root {
                --LiveDataInspectorWidth: ${inspectorWidth || 375}px;
            }
        }

        @media (min-width: ${XL}px) {
            :root {
                --LiveDataInspectorWidth: ${inspectorWidth || 488}px;
            }
        }
    `}
`

const Pusher = styled.div`
    //min-width: var(--LiveDataMinMargin);
    //max-width: calc((100vw - 1108px - var(--LiveDataInspectorMinWidth) - 32px) * 0.5);
    //width: calc((100vw - 1108px - var(--LiveDataInspectorWidth) - 32px) * 0.5);
`

const FinalExport = Object.assign(Layout, {
    Pusher,
})
export default FinalExport
