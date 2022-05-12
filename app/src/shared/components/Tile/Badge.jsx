import React from 'react'
import styled, { css } from 'styled-components'
import UnstyledSpinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import Link from '$shared/components/Link'
import NetworkIcon from '$shared/components/NetworkIcon'

const SharedTheme = {
    backgroundColor: '#525252',
}

const SingleBadge = styled.div`
    display: flex;
    align-items: center;
    font-size: 10px;
    height: 15px;
    line-height: 12px;
    padding: 0 4px;
    background-color: #0324ff;
    background-color: ${({ theme }) => theme.backgroundColor};
    color: white !important;

    a,
    a:link,
    a:active,
    a:focus,
    a:hover,
    a:visited {
        color: white !important;
    }

    > * + * {
        margin-left: 8px;
    }
`

const BadgeContainer = styled.div`
    align-items: center;
    color: white !important;
    display: flex;
    cursor: default;
    pointer-events: none;
    user-select: none;
    margin: 0.5em;

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

    > ${SingleBadge} {
        margin-left: 1px;
    }

    ${SingleBadge}:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    ${SingleBadge}:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    ${SingleBadge}:only-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
`

const Badge = styled(BadgeContainer)``

const StyledChainBadge = styled(Badge)`
    font-size: 18px;
    line-height: 18px;
    background-color: transparent;

    ${NetworkIcon} {
        height: 24px;
        width: 24px;
    }

    & span {
        margin-left: 8px;
    }
`

const Spinner = styled(UnstyledSpinner)`
    height: 10px;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 10px;
`

const DeployingBadge = (props) => (
    <BadgeContainer {...props}>
        <SingleBadge>
            <span>Deploying</span>
            <Spinner size="tiny" color="white" />
        </SingleBadge>
    </BadgeContainer>
)

const DataUnionBadge = ({ memberCount, linkTo, linkHref, ...props }) => (
    <BadgeContainer {...props}>
        <SingleBadge>Data Union</SingleBadge>
        {memberCount != null && (
            <SingleBadge>
                <Badge.Link
                    to={linkTo}
                    href={linkHref}
                >
                    {memberCount}
                </Badge.Link>
                &nbsp;
                members
            </SingleBadge>
        )}
    </BadgeContainer>
)

const SharedBadge = (props) => (
    <BadgeContainer {...props}>
        <SingleBadge theme={SharedTheme}>
            <span>Shared</span>
        </SingleBadge>
    </BadgeContainer>
)

const ChainBadge = ({ chainId, chainName, ...props }) => (
    <StyledChainBadge {...props}>
        <NetworkIcon chainId={chainId} />
        <span>{chainName}</span>
    </StyledChainBadge>
)

const UnstyledIconBadge = ({ forwardAs, children, icon, ...props }) => (
    <BadgeContainer {...props} as={forwardAs}>
        <SingleBadge>
            <SvgIcon name={icon} />
            {children != null && (
                <div>{children}</div>
            )}
        </SingleBadge>
    </BadgeContainer>
)

const IconBadge = styled(UnstyledIconBadge)`
    svg {
        height: 12px;
        width: auto;
    }
`

const BadgeLink = ({
    left,
    top,
    bottom,
    right,
    ...props
}) => (
    <Link {...props} />
)

Object.assign(Badge, {
    Link: styled(BadgeLink)``,
})

export {
    DataUnionBadge,
    IconBadge,
    DeployingBadge,
    ChainBadge,
    SharedBadge,
    SharedTheme,
}

export default Badge
