import styled from 'styled-components'
import Selector from './Selector'
import { SM, LG } from '$shared/utils/styled'

const StreamSelector = styled(Selector)`
    position: fixed;
    left: 24px;
    top: 150px;

    @media (min-width: ${SM}px) {
        left: 40px;
    }

    @media (min-width: ${LG}px) {
        left: 104px;
    }
`

export default StreamSelector
