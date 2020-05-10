import styled from 'styled-components'
import { BusStop } from '$shared/components/BusLine'
import { MD, LG } from '$shared/utils/styled'

const TOCBusStop = styled(BusStop)`
    position: relative;
    top: -48px;
    
    @media (min-width: ${MD}px) {
        top: -128px;
    }

    @media (min-width: ${LG}px) {
        top: -165px;
    }
`

export default TOCBusStop
