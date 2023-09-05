import React, { FunctionComponent, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import Spinner from '~/shared/components/Spinner'

type AlertType = 'loading' | 'error' | 'success' | 'notice'
export const Alert: FunctionComponent<{
    type: AlertType
    title: string
    children: ReactNode
}> = ({ type, title, children }) => {
    const icon: ReactNode = useMemo(() => {
        switch (type) {
            case 'success':
                return <StyledIcon name="checkmark" />
            case 'error':
                return <StyledIcon name="warnBadge" />
            case 'loading':
                return (
                    <SpinnerWrapper>
                        <Spinner color="blue" />
                    </SpinnerWrapper>
                )
            case 'notice':
                return <StyledIcon name="infoBadge" />
        }
    }, [type])

    return (
        <AlertWrap $type={type}>
            {icon}
            <div>
                <Title>{title}</Title>
                {children}
            </div>
        </AlertWrap>
    )
}

const AlertWrap = styled.div<{ $type: AlertType }>`
    display: flex;
    gap: 16px;
    padding: 20px 16px;
    border-radius: 8px;
  
  ${({ $type }) => {
      let color = 'transparent'
      switch ($type) {
          case 'success':
              color = COLORS.alertSuccessBackground
              break
          case 'error':
              color = COLORS.alertErrorBackground
              break
          case 'loading':
          case 'notice':
              color = COLORS.alertInfoBackground
              break
      }
      return css`
          background-color: ${color};
      `
  }}}
`

const StyledIcon = styled(SvgIcon)`
    width: 22px;
    height: 22px;
`

const SpinnerWrapper = styled.div`
    // hacky override of pcss styles
    .shared_spinner_container {
        align-self: auto;
        .shared_spinner_spinner {
            min-height: 20px;
            min-width: 20px;
        }
    }
`

const Title = styled.p`
    font-weight: ${MEDIUM};
    line-height: 22px;
`
