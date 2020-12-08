import styled from 'styled-components'
import Selector from './Selector'
import { SM, LG } from '$shared/utils/styled'

const PartitionSelector = styled(Selector)`
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1;

    @media (min-width: ${SM}px) {
        left: calc(100% - 504px);
        top: 150px;
        bottom: auto;
        right: auto;
    }

    @media (min-width: ${LG}px) {
        left: 360px;
        top: 150px;
        bottom: auto;
        right: auto;
    }
`

export default PartitionSelector
