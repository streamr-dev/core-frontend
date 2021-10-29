import styled from 'styled-components'
import { MD as TABLET, MEDIUM } from '$shared/utils/styled'

export const ImageWrap = styled.div`
    align-items: center;
    display: flex;
    height: 28px; /* <p>'s line height. */
    flex: 0;
    margin-right: 16px;

    @media (min-width: ${TABLET}px) {
        height: auto;
        margin-right: 32px;
    }
`

const Concept = styled.div`
    & + & {
        margin-top: 16px;
    }

    em {
        color: #0324FF;
        font-style: normal;
        font-weight: ${MEDIUM};
    }

    img {
        display: block;
        width: 24px;
    }

    && p {
        margin: 0;
    }

    a {
        background: #F8F8F8;
        border-radius: 4px;
        display: flex;
        padding: 16px;
    }

    @media (min-width: ${TABLET}px) {
        a {
            padding: 24px 32px;
        }

        img {
            width: 48px;
        }
    }
`

export default Concept
