import styled from 'styled-components'

import { MD } from '$shared/utils/styled'

const Description = styled.p`
    line-height: 24px;
    display: none;

    strong {
        font-weight: var(--medium);
    }

    @media (min-width: ${MD}px) {
        display: block;
    }
`

export default Description
