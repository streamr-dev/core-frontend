import styled from 'styled-components'
import { MD as TABLET } from '$shared/utils/styled'

export const ImageWrap = styled.div`
    align-items: center;
    display: flex;
    height: 280px;
    justify-content: center;

    img {
        max-width: 66%;
        width: 144px;
        transform: translateX(-3%); /* Better horizontal alignment. */
    }

    @media (min-width: ${TABLET}px) {
        align-items: flex-start;
        height: auto;
        flex-grow: 1;

        img {
            width: 192px;
        }
    }
`

export const ExternalLinkWrap = styled.div`
    align-items: center;
    display: flex;
    margin-left: 16px;
`

const Explore = styled.div`
    background: #F8F8F8;
    border-radius: 8px;
    padding: 16px;

    && ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    && li::before {
        display: none;
    }

    && p {
        margin: 8px 0 0;
    }

    a {
        background: #ffffff;
        border-radius: 4px;
        display: flex;
        padding: 16px;
    }

    a > div {
        flex-grow: 1;
    }

    a img {
        flex: 0;
    }

    li + li {
        margin-top: 16px;
    }

    img {
        display: block;
    }

    @media (min-width: ${TABLET}px) {
        display: flex;
        padding: 32px 32px 32px 0;

        a {
            padding: 24px 20px 24px 24px;
        }

        ul {
            max-width: 376px;
        }
    }
`

export default Explore
