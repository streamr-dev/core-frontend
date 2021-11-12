import styled from 'styled-components'
import { MD as TABLET, XL as DESKTOP } from '$shared/utils/styled'

export const ImageWrap = styled.figure`
    align-items: center;
    display: flex;
    justify-content: center;
    /* The following overrides global styling. */
    margin: 0 !important;
    width: auto !important;

    img {
        max-width: 66% !important;
    }
`

const Panels = styled.div`
    background: linear-gradient(111.37deg, #1620D5 5.56%, #571CAD 96.49%);
    border-radius: 8px;
    padding: 20px;

    && h4 {
        color: #0324FF;
        font-size: 20px;
        line-height: 22px;
        margin: 0;
    }

    && p {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        margin: 12px 0 0;
    }

    a {
        color: inherit !important;
        display: block;
    }

    a + a {
        margin-top: 20px;
    }

    a > div {
        background: #ffffff;
        border-radius: 4px;
        padding: 20px;
    }

    img {
        display: block;
    }

    ${ImageWrap} {
        height: 280px;
    }

    @media (min-width: ${TABLET}px) {
        display: flex;
        padding: 18px;

        && p {
            margin-top: 16px;
        }

        a {
            flex-basis: 50%;
        }

        a + a {
            margin: 0 0 0 16px;
        }

        a > div {
            padding-top: 24px;
            padding-bottom: 24px;
        }

        ${ImageWrap} {
            height: 240px;
        }
    }

    @media (min-width: ${DESKTOP}px) {
        ${ImageWrap} {
            height: 280px;
        }
    }
`

export default Panels
