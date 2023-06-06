import styled from 'styled-components'
import Segment from '$shared/components/Segment'
import { SM, MD, LG, XL, COLORS, MAX_BODY_WIDTH } from '$shared/utils/styled'

export const ProjectPageContainer = styled.div`
    max-width: ${MAX_BODY_WIDTH}px;
    margin: 0 auto;
    position: relative;
    padding: 24px;

    & & {
        padding: 0 24px;
    }

    @media (min-width: ${MD}px) {
        padding: 40px;

        & & {
            padding: 0;
        }
    }

    @media (min-width: ${LG}px) {
        padding: 60px 0;
    }
`
const ProjectPage = styled.div`
    color: #323232;
    background-color: ${COLORS.secondary};

    ${Segment} {
        margin-top: 24px;
    }

    @media (min-width: ${SM}px) {
        ${Segment} {
            margin-top: 32px;
        }
    }

    @media (min-width: ${MD}px) {
        ${Segment} {
            margin-top: 48px;
        }
    }

    @media (min-width: ${XL}px) {
        ${Segment} {
            margin-top: 64px;
        }
    }
`

export default ProjectPage
