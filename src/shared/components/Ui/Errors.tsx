import React, { Fragment, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { ERROR } from '~/shared/components/Ui/StateColors'
type Props = {
    children?: ReactNode
    overlap?: boolean
    theme?: {
        color: string
    }
}
export const MarketplaceTheme = {
    color: '#ff5c00',
}
const DefaultTheme = {
    color: ERROR,
}

const UnstyledErrors = ({ children, theme, overlap, ...props }: Props) => (
    <div {...props}>{children || <Fragment>&zwnj;</Fragment>}</div>
)

const Errors = styled(UnstyledErrors)`
    color: ${({ theme }) => theme.color};
    font-size: 12px;
    line-height: 1.5em;
    margin-top: 6px;
    word-break: break-word;

    ${({ overlap }) =>
        !!overlap &&
        css`
            position: absolute;
        `}
`
Errors.defaultProps = {
    theme: DefaultTheme,
}
export default Errors
