import React, { Fragment, FunctionComponent } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
    Button,
    HamburgerButton,
    Logo,
    LogoLink,
    Menu as UnstyledMenu,
    Navbar as UnstyledNavbar,
    NavDropdown,
    NavProvider,
    NavLink,
    NavOverlay,
} from '@streamr/streamr-layout'

import docsLinks from '$shared/../docsLinks'
import { MD as TABLET, LG as DESKTOP, SM as MOBILE } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import { selectUserData } from '$shared/modules/user/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import ActivityList from '$shared/components/ActivityList'
import { useSessionMethod } from '$shared/reducers/session'
import ActivityListItems from '$shared/components/ActivityList/ActivityListItems'
import routes from '$routes'
import User, { Avatarless, Name, Username, UsernameCopy } from './User'
import SiteSection from './SiteSection'
import MetamaskIcon from './metamask.svg'
import WalletconnectIcon from './walletConnect.svg'

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
const BellIcon = styled(SvgIcon)`
    height: 20px;
    width: 16px;
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
const Menu = styled(UnstyledMenu)``
const UnpaddedMenu = styled(Menu)`
    padding: 0 !important;
`
const SignedInUserMenu = styled(NavDropdown)`
    ${Menu} {
        padding-top: 4px;

        ${Menu.Item}:first-child {
            padding: 0 4px;
            margin-bottom: 10px;
        }

        ${Avatarless} {
            text-align: center;
            background: #f8f8f8;
            border-radius: 4px;
            padding: 16px 6px;
            width: 160px;
            user-select: none;
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

const Navbar = styled(UnstyledNavbar)`
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
`

const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    justify-content: center;
`

const UnstyledNavDivider: FunctionComponent = (props) => (
    <div {...props}>
        <div />
    </div>
)

const NavDivider = styled(UnstyledNavDivider)`
    height: 16px;
    opacity: 0.6;
    padding: 0 8px;

    > div {
        background-color: currentColor;
        content: '';
        height: 100%;
        width: 1px;
    }
`

const UnstyledDesktopNav: FunctionComponent = (props) => {
    const { highlight: current } = NavProvider.useState()
    const { pathname } = useLocation()
    const currentUser = useSelector(selectUserData)

    return (
        <div {...props}>
            <Navbar>
                <Navbar.Item spread>
                    <LogoLink href={routes.root()}>
                        <Logo />
                    </LogoLink>
                </Navbar.Item>
                <MenuGrid>
                    <Navbar.Item data-desktop-only>
                        <NavDropdown
                            highlight={current === 'marketplace'}
                            toggle={
                                <NavLink as={Link} to={routes.marketplace.index()}>
                                    Projects
                                </NavLink>
                            }
                        />
                    </Navbar.Item>
                    <Navbar.Item data-desktop-only>
                        <NavDropdown
                            highlight={current === 'streams'}
                            toggle={
                                <NavLink as={Link} to={routes.streams.index()}>
                                    Streams
                                </NavLink>
                            }
                        />
                    </Navbar.Item>
                    <Navbar.Item data-desktop-only>
                        <NavDropdown
                            highlight={current === 'network'}
                            toggle={
                                <NavLink as={Link} href={routes.networkExplorer()} rel="noopener noreferrer" target="_blank">
                                    Network
                                </NavLink>
                            }
                        />
                    </Navbar.Item>
                    <Navbar.Item data-desktop-only>
                        <NavDropdown
                            highlight={current === 'docs'}
                            toggle={
                                <NavLink as={Link} to={docsLinks.docs}>
                                    Docs
                                </NavLink>
                            }
                        />
                    </Navbar.Item>
                </MenuGrid>
                {!currentUser && (
                    <Fragment>
                        <Navbar.Item
                            style={{
                                marginLeft: '4px',
                            }}
                            data-desktop-only
                        >
                            <NavDivider />
                        </Navbar.Item>
                        <Navbar.Item data-desktop-only>
                            <Button
                                tag="a"
                                href={routes.auth.login({
                                    redirect: pathname,
                                })}
                                kind="primary"
                                size="mini"
                                outline
                            >
                                Connect Wallet
                            </Button>
                        </Navbar.Item>
                    </Fragment>
                )}
                {!!currentUser && (
                    <Fragment>
                        <Navbar.Item data-desktop-only>
                            <UsernameCopy username={currentUser.username} />
                        </Navbar.Item>
                        <Navbar.Item
                            style={{
                                marginLeft: 0,
                            }}
                            data-desktop-only
                        >
                            <SignedInUserMenu
                                edge
                                alignMenu="right"
                                nodeco
                                toggle={
                                    <NavLink>
                                        <DropdownToggle>
                                            <CaretDownIcon name="caretDown" />
                                            <CaretUpIcon name="caretUp" />
                                        </DropdownToggle>
                                    </NavLink>
                                }
                                menu={
                                    <Menu>
                                        <Menu.Item>
                                            <Avatarless source={currentUser} />
                                        </Menu.Item>
                                        <Menu.Item as={Link} to={routes.profile()}>
                                            Settings
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item as={Link} to={routes.auth.logout()}>
                                            Sign out
                                        </Menu.Item>
                                    </Menu>
                                }
                            />
                        </Navbar.Item>
                    </Fragment>
                )}
                <HamburgerButton idle />
            </Navbar>
        </div>
    )
}

const ConnectedWith = styled.div`
    background-color: #f8f8f8;
    display: none;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    font-weight: var(--normal);
    font-size: 12px;
    text-align: center;
    color: #323232;
    padding: 0 8px;

    img {
        width: 1em;
    }

    strong {
        display: none;
    }

    @media (min-width: 268px) {
        display: block;
    }

    @media (min-width: 310px) {
        span {
            margin-right: 0.1em;
        }

        span::before {
            content: 'Using ';
        }
    }

    @media (min-width: 346px) {
        span::before {
            content: 'Connected with ';
        }
    }

    @media (min-width: 424px) {
        span {
            margin-right: 0;
        }

        img {
            display: none;
        }

        strong {
            display: inline;
        }
    }
`
const methods: {[key: string]: any} = {
    metamask: 'MetaMask',
    walletConnect: 'WalletConnect',
}

const UnstyledMobileNav: FunctionComponent<{className?: string}> = ({ className }) => {
    const currentUser = useSelector(selectUserData)
    const method = useSessionMethod()
    const { pathname } = useLocation()
    return (
        <NavOverlay className={className}>
            <NavOverlay.Head>
                <Navbar>
                    <Navbar.Item spread>
                        <LogoLink href={routes.root()}>
                            <Logo />
                        </LogoLink>
                    </Navbar.Item>
                    {currentUser ? (
                        <Navbar.Item>
                            <ConnectedWith>
                                <span>&zwnj;</span>
                                <img src={icons[method]} alt="" />
                                <strong>{methods[method]}</strong>
                            </ConnectedWith>
                        </Navbar.Item>
                    ) : (
                        <Navbar.Item />
                    )}
                    <Navbar.Item>
                        <HamburgerButton />
                    </Navbar.Item>
                </Navbar>
            </NavOverlay.Head>
            <NavOverlay.Body>
                <NavOverlay.Link as={Link} to={routes.core()}>
                    Core
                </NavOverlay.Link>
                <NavOverlay.Link as={Link} to={routes.marketplace.index()}>
                    Marketplace
                </NavOverlay.Link>
                <NavOverlay.Link as={Link} to="/docs">
                    Docs
                </NavOverlay.Link>
                {!currentUser ? (
                    <NavOverlay.Link>Settings</NavOverlay.Link>
                ) : (
                    <NavOverlay.Link as={Link} to={routes.profile()}>
                        Settings
                    </NavOverlay.Link>
                )}
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {currentUser ? (
                    <Button tag={Link} to={routes.auth.logout()} kind="secondary" size="normal">
                        Sign out
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
        > ${Navbar.Item}:first-child {
            flex-grow: initial;
        }

        > ${Navbar.Item}:nth-child(2) {
            flex-grow: 1;
        }
    }

    @media (min-width: ${DESKTOP}px) {
        ${Navbar} > ${Navbar.Item}:first-child {
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
    ${UsernameCopy},
    ${ConnectedWith} {
        margin-right: 16px;
    }

    ${NavLink}:not([href]) {
        color: #cdcdcd;
    }

    @media (min-width: ${TABLET}px) {
        ${User} {
            padding: 16px 64px 48px 64px;
        }
    }
`

const UnstyledContainer: FunctionComponent = (props) => <div {...props} />

export const NavContainer = styled(UnstyledContainer)`
    background-color: #ffffff;
    color: #323232;

    ${Navbar} {
        padding: 20px 24px;

        @media (min-width: ${TABLET}px) {
            padding: 16px 24px;
        }

        @media (min-width: ${DESKTOP}px) {
            padding: 16px 24px;
        }

        > ${HamburgerButton} {
            display: flex;
        }

        ${Navbar.Item}:empty {
            display: none;
        }

        > [data-mobile-only='true'] {
            display: block;
        }

        > [data-desktop-only='true'] {
            display: none;
        }
    }

    ${Button} {
        padding: 0 16px;
    }

    @media (min-width: ${DESKTOP}px) {
        ${Navbar} > [data-mobile-only=true] {
            display: none;
        }

        ${Navbar} > ${HamburgerButton} {
            display: none;
        }
    }

    @media (min-width: ${MOBILE}px) {
        ${Navbar} > [data-desktop-only=true] {
            display: block;
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
