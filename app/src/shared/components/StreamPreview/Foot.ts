import styled from 'styled-components'
import { TABLET } from '$shared/utils/styled'
const Foot = styled.div`
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    height: 80px;
    padding: 0 24px;
    position: fixed;
    bottom: 0px;
    width: 100%;

    > div + div {
        margin-left: 32px;
    }

    @media (${TABLET}) {
        display: none;
    }
`
export default Foot
