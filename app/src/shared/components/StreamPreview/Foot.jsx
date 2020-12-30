import styled from 'styled-components'

const Foot = styled.div`
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    height: 80px;
    padding: 0 24px;

    > div + div {
        margin-left: 32px;
    }

    @media (min-width: 668px) {
        display: none;
    }
`

export default Foot
