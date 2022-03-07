import styled from 'styled-components'
import PrestyledListContainer from '$shared/components/Container/List'
import { MD, LG } from '$shared/utils/styled'

const ListContainer = styled(PrestyledListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

export default ListContainer
