import styled, { css } from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'

const Header = styled.div`
    align-items: center;
    background-color: #efefef;
    color: #525252;
    display: flex;
    font-size: 14px;
    font-weight: ${MEDIUM};
    letter-spacing: 1.17px;
    line-height: 16px;
    padding: 28px 32px;
    text-transform: uppercase;
`

const Body = styled.div`
    background-color: #f8f8f8;

    & + & {
        border-top: #e7e7e7;
    }

    ${({ pad }) => !!pad && css`
        padding: 28px 32px;
    `}
`

const Footer = styled.div``

const Segment = styled.div``

Object.assign(Segment, {
    Header,
    Body,
    Footer,
})

export default Segment
