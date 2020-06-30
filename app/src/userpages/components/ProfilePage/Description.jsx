import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'

import { MD } from '$shared/utils/styled'

const Description = styled(Translate)`
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
