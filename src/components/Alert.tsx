import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import Spinner from '~/shared/components/Spinner'

type AlertType = 'loading' | 'error' | 'success' | 'notice'

export const Alert: FunctionComponent<{
    type: AlertType
    title: string
    className?: string
    children?: ReactNode
}> = ({ type, title, className, children }) => {
    return (
        <AlertWrap $type={type} className={className}>
            <AlertIcon type={type} />
            <div>
                <Title>{title}</Title>
                {children != null && <Content>{children}</Content>}
            </div>
        </AlertWrap>
    )
}

const AlertIcon: FunctionComponent<{ type: AlertType }> = ({ type }) => {
    switch (type) {
        case 'success':
            return <StyledIcon name="checkmark" />
        case 'error':
            return <StyledIcon name="warnBadge" />
        case 'loading':
            return <StyledSpinner color="blue" size="medium" />
        case 'notice':
            return <StyledIcon name="infoBadge" />
    }
}

const getAlertBackgroundColor = ({ $type }: { $type: AlertType }) => {
    switch ($type) {
        case 'success':
            return COLORS.alertSuccessBackground
        case 'error':
            return COLORS.alertErrorBackground
        case 'loading':
        case 'notice':
            return COLORS.alertInfoBackground
        default:
            return 'transparent'
    }
}

const AlertWrap = styled.div<{ $type: AlertType }>`
    display: flex;
    gap: 16px;
    padding: 20px 16px;
    border-radius: 8px;
    background-color: ${getAlertBackgroundColor};
`

const StyledIcon = styled(SvgIcon)`
    width: 22px;
    height: 22px;
    flex-shrink: 0;
`

const StyledSpinner = styled(Spinner)`
    align-self: baseline !important;
    flex-shrink: 0;
`

const Title = styled.p`
    font-weight: ${MEDIUM};
    line-height: 20px;
    margin: 0;
`

const Content = styled.div`
    margin-top: 4px;
    line-height: 20px;
`
