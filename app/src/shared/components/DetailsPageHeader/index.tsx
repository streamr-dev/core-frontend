import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COLORS, DESKTOP, TABLET, XL } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import LinkTabs, { LinkTabOptionProps } from '$shared/components/LinkTabs'

export type DetailsPageHeaderProps = {
    backButtonLink?: string
    pageTitle?: ReactNode,
    currentPageUrl: string,
    linkTabs: LinkTabOptionProps[]
}

export const DetailsPageHeader: FunctionComponent<DetailsPageHeaderProps> = ({
    backButtonLink,
    pageTitle,
    currentPageUrl,
    linkTabs
}) => {
    return <DetailsPageHeaderWrap>
        <DetailsPageHeaderContainer>
            <DetailsPageHeaderBar>
                <LeftSideContainer>
                    {!!backButtonLink && <BackLink to={backButtonLink}><BackButtonIcon name={'backArrow'}></BackButtonIcon></BackLink>}
                    {!!pageTitle && <PageTitleContainer>{pageTitle}</PageTitleContainer>}
                </LeftSideContainer>
                <RightSideContainer>
                    <LinkTabs selectedOptionHref={currentPageUrl} options={linkTabs} fullWidth={'mobileAndTablet'}></LinkTabs>
                </RightSideContainer>
            </DetailsPageHeaderBar>
        </DetailsPageHeaderContainer>
    </DetailsPageHeaderWrap>
}

const DetailsPageHeaderWrap = styled.div`
  background-color: white;
`

const DetailsPageHeaderContainer = styled.div`
  margin: 0 auto;
  padding: 45px 24px 22px;
  & & {
    padding: 0 24px;
  }
  @media(${DESKTOP}) {
    padding: 130px 32px 30px;
  }
  @media (${TABLET}) {
    max-width: 1360px;

    & & {
      padding: 0;
    }
  }
`

const DetailsPageHeaderBar = styled.div`
  display: block;
  @media(${DESKTOP}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const LeftSideContainer = styled.div`
  display: flex;
  align-items: center;
`

const RightSideContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  @media(${DESKTOP}) {
    margin-top: 0;
  }
`

const BackLink = styled(Link)`
  padding: 10px;
  line-height: 30px;
  margin-right: 14px;
`
const BackButtonIcon = styled(SvgIcon)`
  color: ${COLORS.primaryLight};
`

const PageTitleContainer = styled.div`
  padding-left: 10px;
  margin-top: 3px;
  color: ${COLORS.primary};
  font-size: 16px;
  line-height: 30px;
`
