// @flow

import React, { type Node } from 'react'
import styled, { css } from 'styled-components'
import UnstyledSpinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'

type BadgeProps = {
    bottom?: boolean,
    left?: boolean,
    right?: boolean,
    top?: boolean,
}

const SharedTheme = {
    backgroundColor: '#525252',
}

const Badge = styled.div`
    align-items: center;
    background-color: #0324ff;
    background-color: ${({ theme }) => theme.backgroundColor};
    border-bottom-left-radius: ${({ bottom, left }) => (bottom || left ? 0 : 2)}px;
    border-bottom-right-radius: ${({ bottom, left, right }) => (bottom || (!left && right) ? 0 : 2)}px;
    border-top-left-radius: ${({ top, left }) => (top || left ? 0 : 2)}px;
    border-top-right-radius: ${({ top, left, right }) => (top || (!left && right) ? 0 : 2)}px;
    color: white !important;
    cursor: default;
    display: flex;
    font-size: 12px;
    height: 24px;
    line-height: 1em;
    padding: 0 12px;
    pointer-events: none;
    user-select: none;

    a& {
        cursor: pointer;
        pointer-events: auto;
        text-decoration: none !important;
    }

    ${({ top, left, right, bottom }) => !!(top || left || right || bottom) && css`
        position: absolute;
    `}

    ${({ bottom, top }) => !!bottom && !top && css`
        bottom: 0;
    `}

    ${({ left }) => !!left && css`
        left: 0;
    `}

    ${({ right, left }) => !!right && !left && css`
        right: 0;
    `}

    ${({ top }) => !!top && css`
        top: 0;
    `}

    > * + * {
        margin-left: 12px;
    }
`

const Spinner = styled(UnstyledSpinner)`
    height: 12px;
    min-height: 0;
    min-width: 0;
    width: 12px;
`

const DeployingBadge = (props: BadgeProps) => (
    <Badge {...props}>
        <span>Deploying</span>
        <Spinner size="small" color="white" />
    </Badge>
)

const DataUnionBadge = (props: BadgeProps) => (
    <Badge {...props}>
        <span>Data Union</span>
    </Badge>
)

const SharedBadge = (props: BadgeProps) => (
    <Badge {...props} theme={SharedTheme}>
        <span>Shared</span>
    </Badge>
)

type IconBadgeProps = BadgeProps & {
    children?: Node,
    icon: string,
    forwardAs?: any,
}

// $FlowFixMe `icon` is missing in `BadgeProps` but I just wanted it here.
const UnstyledIconBadge = ({ forwardAs, children, icon, ...props }: IconBadgeProps) => (
    <Badge as={forwardAs} {...props}>
        <SvgIcon name={icon} />
        {children != null && (
            <div>{children}</div>
        )}
    </Badge>
)

const IconBadge = styled(UnstyledIconBadge)`
    svg {
        height: 12px;
        width: auto;
    }
`

export {
    DataUnionBadge,
    IconBadge,
    DeployingBadge,
    SharedBadge,
    SharedTheme,
}

export default Badge
