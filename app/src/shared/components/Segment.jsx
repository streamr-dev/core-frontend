import styled, { css } from 'styled-components'
import { MEDIUM, MD } from '$shared/utils/styled'

const Header = styled.div`
    align-items: center;
    background-color: #efefef;
    border-radius: 2px 2px 0 0;
    color: #323232;
    display: flex;
    font-size: 12px;
    font-weight: ${MEDIUM};
    height: 64px;
    letter-spacing: 1.17px;
    line-height: 16px;
    padding: 0 24px;
    text-transform: uppercase;

    @media (min-width: ${MD}px) {
        font-size: 14px;
        height: 72px;
        padding: 0 32px;
    }
`

const Footer = styled.div``

const Body = styled.div`
    background-color: #f8f8f8;

    :last-child {
        border-radius: 0 0 2px 2px;
    }

    & + & {
        border-top: 1px solid #e7e7e7;
    }

    ${({ pad }) => !!pad && css`
        padding: 24px;

        @media (min-width: ${MD}px) {
            padding: 32px;
        }
    `}
`

const Segment = styled.div``

Object.assign(Segment, {
    Header,
    Body,
    Footer,
})

export default Segment
