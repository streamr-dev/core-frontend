import styled from 'styled-components'
import { PHONE, DESKTOP } from '~/shared/utils/styled'
const Grid = styled.div`
    > * + * {
        margin-top: 24px;
    }

    @media ${PHONE} {
        display: grid;
        grid-column-gap: 24px;
        grid-row-gap: 24px;
        grid-template-columns: 1fr 1fr;

        > * + * {
            margin-top: 0;
        }
    }

    @media ${DESKTOP} {
        grid-column-gap: 16px;
        grid-row-gap: 16px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`
export default Grid
