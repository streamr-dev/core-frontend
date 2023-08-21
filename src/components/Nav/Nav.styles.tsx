import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Menu as UnstyledMenu, NavDropdown } from '@streamr/streamr-layout'
import { AccordionBody, AccordionHeader } from 'reactstrap'
import SvgIcon from '~/shared/components/SvgIcon'
import AvatarImage from '~/shared/components/AvatarImage'
import { COLORS, DESKTOP, MEDIUM, REGULAR, TABLET } from '~/shared/utils/styled'
import { Avatarless, Name, Username } from './User'

export const MOBILE_LG = 576
const CaretDownIcon = styled(SvgIcon)`
    opacity: 1;
`
const CaretUpIcon = styled(SvgIcon)`
    opacity: 0;
`
const DropdownToggle = styled.div`
    background: #f8f8f8;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    position: relative;
    margin-top: 1px;

    svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        transition: 200ms opacity;
    }
`
export const Menu = styled(UnstyledMenu)``
export const MenuItem = styled(Menu.Item)`
    &.user-info {
        padding: 0 16px !important;
    }
    &.disconnect {
        padding: 0 !important;
        .disconnect-text {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
`
export const MenuDivider = styled(Menu.Divider)`
    margin: 0;
`
export const WalletAddress = styled.div`
    margin-left: 13px;
    display: flex;
    flex-direction: column;

    span {
        font-size: 14px;
        line-height: 18px;
        user-select: none;
        color: ${COLORS.primary};
        font-weight: 400;

        &.ens-name {
            font-weight: 500;
        }
    }
`
export const SignedInUserMenu = styled(NavDropdown)`
    ${Menu} {
        width: 260px;
        padding: 0;

        ${Menu.Item}:first-child {
            padding: 0 4px;
            margin-bottom: 10px;
        }

        ${Avatarless} {
        }

        ${Name},
        ${Username} {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    :hover ${DropdownToggle} {
        ${CaretDownIcon} {
            opacity: 0;
        }

        ${CaretUpIcon} {
            opacity: 1;
        }
    }
`
export const Navbar = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
`
export const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    justify-content: center;
    align-items: center;
`
export const NavLink = styled.a``
export const NavbarItem = styled.div`
    ${MenuGrid} & + & {
        margin-left: 16px;
    }
`
const LinkWrapper = styled.div`
    ${NavLink} {
        display: block;
        color: ${COLORS.primaryLight};
        text-transform: uppercase;
        font-weight: ${MEDIUM};
        letter-spacing: 2px;
        white-space: nowrap;
        text-decoration: none !important;
    }

    &:hover {
        ${NavLink} {
            color: ${COLORS.primary};
        }
    }
`
type UnstyledNavbarLinkProps = {
    children: any
}
const UnstyledNavbarLink: FunctionComponent<UnstyledNavbarLinkProps> = ({
    children,
    ...props
}) => {
    return <LinkWrapper {...props}>{children}</LinkWrapper>
}

export const NavbarLinkDesktop = styled(UnstyledNavbarLink)<{ highlight?: boolean }>`
    position: relative;

    ${NavLink} {
        font-size: 12px;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
    }

    &:after {
        display: block;
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transition: width 0.2s ease-out;
        width: 0;
        height: 2px;
        background-color: ${COLORS.primary};
        transform: translateX(-50%);
    }

    &:hover:after {
        transition: width 0.2s ease-in;
        width: 20px;
    }

    ${({ highlight = false }) =>
        highlight &&
        css`
            &:after {
                left: 50%;
                width: 20px;
            }

            ${NavLink} {
                color: ${COLORS.primary};
            }
        `}
`
export const NetworkNavElement = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: none;
  line-height: 24px;

  .title {
    font-size: 16px;
    font-weight: ${MEDIUM};
    color: ${COLORS.black};
    margin: 0;
    letter-spacing: initial;
  }

  .subtitle {
    font-size: 16px;
    font-weight ${REGULAR};
    color: ${COLORS.primaryLight};
    margin: 0;
    max-width: 350px;
    white-space: pre-line;
    letter-spacing: initial;
  }
`
export const NavbarLinkMobile = styled(UnstyledNavbarLink)<{ highlight?: boolean }>`
    position: relative;
    border-bottom: 1px solid #efefef;

    ${NavLink} {
        font-size: 18px;
        line-height: 100px;
        color: ${COLORS.primary};
    }

    ${({ highlight = false }) =>
        highlight &&
        css`
            &:after {
                display: block;
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: -24px;
                width: 3px;
                height: 32px;
                background-color: ${COLORS.primary};
            }

            ${NavLink} {
                color: ${COLORS.primary};
            }

            @media (min-width: ${MOBILE_LG}px) {
                &:after {
                    left: -64px;
                }
            }
        `}
`
export const NavbarItemAccount = styled.div`
    margin-left: auto;
    margin-right: 15px;

    @media (${TABLET}) {
        margin-right: 0;
    }
`
const UnstyledLogoLink: FunctionComponent<{ children?: any; href: string }> = ({
    children,
    ...props
}) => {
    return <a {...props}>{children}</a>
}
export const LogoLink = styled(UnstyledLogoLink)`
    color: #f65f0a !important;
    display: block;
    max-width: 64px;
    width: 32px;

    @media (${DESKTOP}) {
        width: 40px;
    }
`
export const Avatar = styled(AvatarImage)`
    width: 32px;
    height: 32px;
    border: 1px solid #f3f3f3;
    border-radius: 50%;
    background-color: white;

    @media (${DESKTOP}) {
        width: 40px;
        height: 40px;
    }
`
export const MenuItemAvatarContainer = styled.div`
    background-color: ${COLORS.secondaryLight};
    padding: 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 16px 0;
`
export const UserInfoMobile = styled.div`
    background-color: #f8f8f8;
    padding: 8px;
    display: flex;
    justify-content: flex-start;
    border-radius: 4px;

    ${Avatar} {
        width: 45px;
        height: 45px;
        background-color: #fff;
        margin-right: 8px;
    }

    ${Avatarless} {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        ${Name} {
            font-size: 14px;
            font-weight: ${REGULAR};
            line-height: 1.25em;
        }

        ${Username} {
            padding: 3px;
            font-size: 12px;
            font-weight: ${MEDIUM};
            background-color: #fff;
            color: #848484;
            margin: 3px 0;
        }
    }
`

export const StyledAccordionBody = styled(AccordionBody)`
    white-space: normal;
`

export const StyledAccordionHeader = styled(AccordionHeader)`
    margin: 0;
    button {
        font-size: 18px;
        line-height: 100px;
        color: #323232;
        text-transform: uppercase;
        border: none;
        background-color: transparent;
        font-weight: ${MEDIUM};
        padding: 0;
        display: block;
        width: 100%;

        .network-dropdown-button-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .caret-down {
                width: 20px;
                transition: transform 250ms ease-in-out;
                &.is-open {
                    transform: rotate(180deg);
                }
            }
        }
    }
`
export const NetworkMobileLink = styled(Link)`
    margin-bottom: 40px;
    display: block;
`
