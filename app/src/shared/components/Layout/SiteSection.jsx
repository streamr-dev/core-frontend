import styled from 'styled-components'
import { MD as TABLET, MEDIUM } from '$shared/utils/styled'

const SiteSection = styled.div`
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin-left: 16px;
    text-transform: uppercase;

    @media (min-width: ${TABLET}px) {
        margin-left: 24px;
    }
`

export default SiteSection
