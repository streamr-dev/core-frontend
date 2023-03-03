import styled from 'styled-components'
import Segment from '$shared/components/Segment'
import { SM, MD, LG, XL, COLORS } from '$shared/utils/styled'

export const ProjectPageContainer = styled.div`
  margin: 0 auto;
  position: relative;
  padding: 24px;

  & & {
    padding: 0 24px;
  }

  @media (min-width: ${MD}px) {
    max-width: 1360px;
    padding: 24px;

    & & {
      padding: 0;
    }
  }

  @media (min-width: ${LG}px) {
    padding: 60px 32px;
  }
`

export const ProjectPageHero = styled.div`
    background-color: #f8f8f8;
    padding: 24px 0;

    @media (min-width: ${SM}px) {
        padding: 32px 0;
    }

    @media (min-width: ${MD}px) {
        padding: 48px 0;
    }

    @media (min-width: ${XL}px) {
        padding: 64px 0;
    }
`
export const ProjectPageSeparator = styled.div`
    background-color: #e7e7e7;
    height: 1px;
    margin: 2em 0;

    @media (min-width: ${LG}px) {
        margin: 3em 0;
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

export const RelatedProductsContainer = styled.div`
  margin-top: 120px;
`

export default ProjectPage
