import React, {Fragment, FunctionComponent} from 'react'
import styled, { css } from 'styled-components'
import { useLocation } from 'react-router-dom'
import {
    Button,
    HamburgerButton,
    Logo,
    Menu as UnstyledMenu,
    NavDropdown,
    NavProvider,
    NavOverlay,
} from '@streamr/streamr-layout'

import docsLinks from '$shared/../docsLinks'
import { MD as TABLET, LG as DESKTOP, COLORS, REGULAR, MEDIUM } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import SvgIcon from '$shared/components/SvgIcon'
import AvatarImage from '$shared/components/AvatarImage'
import AccountsBalance from '$userpages/components/Header/AccountsBalance'
import {useAuthController} from "$auth/hooks/useAuthController"
import {truncate} from "$shared/utils/text"
import routes from '$routes'
import { Avatarless, Name, Username } from './User'
import SiteSection from './SiteSection'
import MetamaskIcon from './metamask.svg'
import WalletconnectIcon from './walletConnect.svg'

const MOBILE_LG = 576

const icons: {[key: string]: any} = {
    metamask: MetamaskIcon,
    walletConnect: WalletconnectIcon,
}
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
const Menu = styled(UnstyledMenu)`
`
const MenuItem = styled(Menu.Item)`
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

const MenuDivider = styled(Menu.Divider)`
  margin: 0;
`

const WalletAddress = styled.div`
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

const SignedInUserMenu = styled(NavDropdown)`
    ${Menu} {
        width: 260px;
        padding: 0;

        ${Menu.Item}:first-child {
            padding: 0 4px;
            margin-bottom: 10px;
        }

        ${Avatarless} {}

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
const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    justify-content: center;
    align-items: center;
`
const NavLink = styled.a``
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
    highlight?: boolean
    children: any
}

const UnstyledNavbarLink: FunctionComponent<UnstyledNavbarLinkProps> = ({highlight, children, ...props}) => {
    return (
        <LinkWrapper {...props}>
            {children}
        </LinkWrapper>
    )
}

const NavbarLinkDesktop = styled(UnstyledNavbarLink)<{ highlight: boolean }>`
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

    &:hover {
        &:after {
            transition: width 0.2s ease-in;
            width: 20px;
        }
    }
    
    ${({ highlight }) => highlight && css`
        &:after {
            left: 50%;
            width: 20px;
        }

        ${NavLink} {
            color: ${COLORS.primary};
        }
    `}
`

const NavbarLinkMobile = styled(UnstyledNavbarLink)<{ highlight: boolean }>`
    position: relative;
    border-bottom: 1px solid #efefef;

    ${NavLink} {
        font-size: 18px;
        line-height: 100px;
    }
    
    ${({ highlight }) => highlight && css`
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

const NavbarItemAccount = styled.div`
    margin-left: auto;
    margin-right: 15px;

    @media (min-width: ${TABLET}px) {
        margin-right: 0;
    }
`

const UnstyledLogoLink: FunctionComponent<{children?: any, href: string}> = ({children, ...props}) => {
    return (
        <a {...props}>{children}</a>
    )
}

export const LogoLink = styled(UnstyledLogoLink)`
    color: #f65f0a !important;
    display: block;
    max-width: 64px;
    width: 32px;

    @media (min-width: ${DESKTOP}px) {
        width: 40px;
    }
`

const Avatar = styled(AvatarImage)`
    width: 32px;
    height: 32px;
    border: 1px solid #F3F3F3;
    border-radius: 50%;
    background-color: white;

    @media (min-width: ${DESKTOP}px) {
        width: 40px;
        height: 40px;
    }
`

const MenuItemAvatarContainer = styled.div`
    background-color: ${COLORS.secondaryLight};
    padding: 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 16px 0;
`

const UserInfoMobile = styled.div`
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

const UnstyledDesktopNav: FunctionComponent = (props) => {
    const { highlight: current } = NavProvider.useState()
    const { pathname } = useLocation()
    const {currentAuthSession} = useAuthController()
    const {address: accountAddress, ensName} = currentAuthSession

    return (
        <div {...props}>
            <Navbar>
                <NavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo />
                    </LogoLink>
                </NavbarItem>
                <MenuGrid data-desktop-only>
                    <NavbarItem>
                        <NavbarLinkDesktop highlight={current === 'marketplace'}>
                            <NavLink as={Link} to={routes.marketplace.index()}>
                                Projects
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarLinkDesktop highlight={current === 'core'}>
                            <NavLink as={Link} to={routes.streams.index()}>
                                Streams
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarLinkDesktop highlight={current === 'network'}>
                            <NavLink as={Link} href={routes.networkExplorer()} rel="noopener noreferrer" target="_blank">
                                Network
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                </MenuGrid>
                {!accountAddress && (
                    <Fragment>
                        <NavbarItemAccount>
                            <Button
                                tag="a"
                                href={routes.auth.login({
                                    redirect: pathname,
                                })}
                                kind="primary"
                                size="mini"
                                outline
                            >
                                Connect
                            </Button>
                        </NavbarItemAccount>
                    </Fragment>
                )}
                {!!accountAddress && (
                    <Fragment>
                        <NavbarItemAccount>
                            <SignedInUserMenu
                                edge
                                alignMenu="right"
                                nodeco
                                toggle={
                                    <Avatar username={accountAddress} />
                                }
                                menu={
                                    <Menu>
                                        <MenuItem className={'user-info'}>
                                            <MenuItemAvatarContainer>
                                                <Avatar username={accountAddress} />
                                                <WalletAddress>
                                                    {!!ensName && <span className={'ens-name'}>{truncate(ensName)}</span>}
                                                    <span>{truncate(accountAddress)}</span>
                                                </WalletAddress>
                                            </MenuItemAvatarContainer>
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem className={'disconnect'} as={Link} to={routes.auth.logout()}>
                                            <div className={'disconnect-text'}>
                                                <span>Disconnect</span>
                                                <SvgIcon name={'disconnect'}/>
                                            </div>
                                        </MenuItem>
                                    </Menu>
                                }
                            />
                        </NavbarItemAccount>
                    </Fragment>
                )}
                <HamburgerButton idle />
            </Navbar>
        </div>
    )
}

const UnstyledMobileNav: FunctionComponent<{className?: string}> = ({ className }) => {
    const { highlight: current } = NavProvider.useState()
    const {currentAuthSession} = useAuthController()
    const { pathname } = useLocation()

    return (
        <NavOverlay className={className}>
            <NavOverlay.Head>
                <Navbar>
                    <NavbarItem>
                        <LogoLink href={routes.root()}>
                            <Logo />
                        </LogoLink>
                    </NavbarItem>
                    <NavbarItem>
                        <HamburgerButton />
                    </NavbarItem>
                </Navbar>
            </NavOverlay.Head>
            <NavOverlay.Body>
                {!!currentAuthSession.address &&
                    <UserInfoMobile>
                        <Avatar username={currentAuthSession.address} />
                        <div>
                            <Avatarless source={currentAuthSession.address} />
                            <AccountsBalance />
                        </div>
                    </UserInfoMobile>
                }
                <NavbarLinkMobile highlight={current === 'marketplace'}>
                    <NavLink as={Link} to={routes.marketplace.index()}>
                        Projects
                    </NavLink>
                </NavbarLinkMobile>
                <NavbarLinkMobile highlight={current === 'core'}>
                    <NavLink as={Link} to={routes.streams.index()}>
                        Streams
                    </NavLink>
                </NavbarLinkMobile>
                <NavbarLinkMobile highlight={current === 'network'}>
                    <NavLink as={Link} href={routes.networkExplorer()} rel="noopener noreferrer" target="_blank">
                        Network
                    </NavLink>
                </NavbarLinkMobile>
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {!!currentAuthSession.address ? (
                    <Button tag={Link} to={routes.auth.logout()} kind="secondary" size="normal">
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        tag="a"
                        href={routes.auth.login({
                            redirect: pathname,
                        })}
                        kind="primary"
                        size="normal"
                    >
                        Connect Wallet
                    </Button>
                )}
            </NavOverlay.Footer>
        </NavOverlay>
    )
}

const DesktopNav = styled(UnstyledDesktopNav)`
    position: relative;

    ${Navbar} {
        > ${NavbarItem}:first-child {
            flex-grow: initial;
        }

        > ${NavbarItem}:nth-child(2) {
            flex-grow: 1;
        }
    }

    @media (min-width: ${DESKTOP}px) {
        ${Navbar} > ${NavbarItem}:first-child {
            flex-grow: 1;
        }
    }

    &[data-shadow='true'] {
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.02);
    }

    ${Avatarless} {
        line-height: 20px;
        padding: 4px 0 8px;
    }

    ${Name} {
        font-size: 14px;
        margin-bottom: 4px;
    }

    ${Username} {
        font-size: 12px;
    }
`

const MobileNav = styled(UnstyledMobileNav)`
    ${NavLink}:not([href]) {
        color: #cdcdcd;
    }

    ${HamburgerButton} {
        margin-left: auto;
    }
  
    ${NavOverlay.Body} {
        padding: 36px 24px 0 24px;

        ${UserInfoMobile} {
            margin-bottom: 24px;
        }
        
        ${NavbarLinkMobile} {
            border-top: 1px solid #efefef;
            
            + ${NavbarLinkMobile} {
                border-top: none;
            }
        }

        >:first-child {
            border-top: none;
        }
    }

    ${NavOverlay.Footer} {
        background-color: #ffffff;
        padding: 24px;

        ${Button} {
            width: 100%;
        }
    }

    @media (min-width: ${MOBILE_LG}px) {
        ${NavOverlay.Body} {
            padding: 36px 64px 0 64px;

            ${UserInfoMobile} {
                margin-bottom: 64px;
            }
        }

        ${NavOverlay.Footer} {
            padding: 64px;

            ${Button} {
                width: auto;
            }
        }
    }
`

const UnstyledContainer: FunctionComponent = (props) => <div {...props} />

export const NavContainer = styled(UnstyledContainer)`
    background-color: #ffffff;
    color: #323232;
  
    ${HamburgerButton} {
      background-color: #F8F8F8;
    }

    ${Navbar} {
        padding: 20px 24px;

        @media (min-width: ${TABLET}px) {
            padding: 20px 24px;
        }

        @media (min-width: ${DESKTOP}px) {
            padding: 20px 40px;
        }

        > ${HamburgerButton} {
            display: flex;
        }

        ${NavbarItem}:empty {
            display: none;
        }

        > [data-desktop-only='true'] {
            display: none;
        }
    }

    ${Button} {
        padding: 0 16px;
    }

    > [data-mobile-only='true'] {
       display: block;
    }

    @media (min-width: ${TABLET}px) {

        ${Navbar} > [data-desktop-only='true'] {
            display: grid;
        }

        ${Navbar} > ${HamburgerButton} {
            display: none;
        }

      > [data-mobile-only='true'] {
        display: none;
      }
    }
`

const N: FunctionComponent<{children?: any, shadow?: any}> = ({ children, shadow, ...props }) => (
    <NavContainer {...props}>
        <DesktopNav data-shadow={!!shadow} />
        <MobileNav />
    </NavContainer>
)

Object.assign(N, {
    Container: NavContainer,
    SiteSection,
})

export default N
