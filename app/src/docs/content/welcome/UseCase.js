import styled from 'styled-components'
import { MD as TABLET, MEDIUM } from '$shared/utils/styled'

const UseCase = styled.div`
    a {
        background: #F8F8F8;
        border-radius: 4px;
        display: flex;
        padding: 16px 12px 16px 16px;
    }

    & + & {
        margin-top: 16px;
    }

    && p {
        color: inherit;
        flex-grow: 1;
        font-weight: ${MEDIUM};
        margin: 0;
    }

    img {
        display: block;
        flex: 0;
        margin-left: 16px;
    }

    @media (min-width: ${TABLET}px) {
        a {
            padding: 24px 28px 24px 32px;
        }
    }
`

export default UseCase
