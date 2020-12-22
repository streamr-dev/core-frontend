import styled from 'styled-components'
import { SM, MD } from '$shared/utils/styled'

const Foot = styled.div`
    background: #ffffff;
    height: 80px;

    @media (min-width: ${MD}px) {
        display: none;
    }
`

export default Foot
