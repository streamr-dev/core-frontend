import styled from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'

const Columns = styled.div`
    border: 1px solid #efefef;
    border-width: 1px 0;
    font-weight: ${MEDIUM};
    position: relative;
`

const Lhs = styled.div`
    height: 54px; /* 56 - 2 (top/bottom border) */
    margin-left: calc((100vw - 504px - 1108px) / 2);
    padding-right: 504px;
    display: grid;
    grid-template-columns: 360px 1fr;
    align-items: center;
`

const Rhs = styled.div`
    align-items: center;
    background: #fafafa;
    border-left: 1px solid #efefef;
    display: flex;
    height: 100%;
    padding-left: 40px;
    position: absolute;
    right: 0;
    top: 0;
    width: 504px;
`

Object.assign(Columns, {
    Lhs,
    Rhs,
})

export default Columns
