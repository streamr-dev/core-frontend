import styled from 'styled-components'

import { MD, LG } from '$shared/utils/styled'

const KeyList = styled.div`
    margin-top: 2.5rem;
    margin-bottom: 2rem;

    &:empty {
        display: none;
    }

    @media (min-width: ${MD}px) {
        &:empty {
            display: block;
            margin-top: 2.5rem;
            height: 1rem;
        }
    }

    @media (min-width: ${LG}px) {
        margin-top: 2.5rem;
        max-width: 536px;

        &:empty {
            display: block;
            margin-top: -2rem;
        }
    }
`
export default KeyList
