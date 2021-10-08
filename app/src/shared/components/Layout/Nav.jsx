import React, { Fragment } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
    Button,
    HamburgerButton,
    Logo,
    LogoLink,
    Menu,
    Navbar,
    NavDropdown,
    NavProvider,
    NavLink,
    NavOverlay,
} from '@streamr/streamr-layout'

import { MD as TABLET, LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import { DevelopersMenu } from '$docs/components/DocsLayout/DocsNav'
import { selectUserData } from '$shared/modules/user/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import ActivityList from '$shared/components/ActivityList'
import { getMethod } from '$shared/utils/sessionToken'
import routes from '$routes'
import User from './User'
import SiteSection from './SiteSection'
import MetamaskIcon from './metamask.svg'
import WalletconnectIcon from './walletConnect.svg'

const icons = {
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
    background: #F8F8F8;
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

const SignedInUserMenu = styled(NavDropdown)`
    ${Menu} {
        padding-top: 4px;

        ${Menu.Item}:first-child {
            padding: 0 4px;
            margin-bottom: 10px;
        }

        ${User.Avatarless} {
            text-align: center;
            background: #F8F8F8;
            border-radius: 4px;
            padding: 16px 6px;
            width: 160px;
            user-select: none;
        }

        ${User.Name},
        ${User.Username} {
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

const UnstyledNavDivider = (props) => (
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

const UnstyledDesktopNav = (props) => {
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
                <Navbar.Item data-mobile-only>
                    <SiteSection>
                        {current}
                    </SiteSection>
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        highlight={current === 'core'}
                        toggle={(
                            <NavLink>
                                Core
                            </NavLink>
                        )}
                        menu={(
                            <Menu>
                                <Menu.Item as={Link} to={routes.streams.index()}>
                                    Streams
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.products.index()}>
                                    Products
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.dataunions.index()}>
                                    Data Unions
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.subscriptions()}>
                                    Subscriptions
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.transactions()}>
                                    Transactions
                                </Menu.Item>
                            </Menu>
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        highlight={current === 'marketplace'}
                        toggle={(
                            <NavLink as={Link} to={routes.marketplace.index()}>
                                Marketplace
                            </NavLink>
                        )}
                    />
                </Navbar.Item>
                <Navbar.Item data-desktop-only>
                    <NavDropdown
                        highlight={current === 'docs'}
                        toggle={(
                            <NavLink>
                                Developers
                            </NavLink>
                        )}
                        menu={(
                            <DevelopersMenu />
                        )}
                    />
                </Navbar.Item>
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
                            <ActivityList>
                                <NavDropdown
                                    alignMenu="right"
                                    nodeco
                                    toggle={(
                                        <NavLink>
                                            <SvgIcon
                                                name="alarmBell"
                                                // eslint-disable-next-line react/jsx-curly-brace-presence
                                                css={`
                                                        height: 20px;
                                                        width: 16px;
                                                `}
                                            />
                                        </NavLink>
                                    )}
                                    menu={(
                                        <Menu
                                            // eslint-disable-next-line react/jsx-curly-brace-presence
                                            css={`
                                                padding: 0 !important;
                                            `}
                                        >
                                            <ActivityList.Items />
                                        </Menu>
                                    )}
                                />
                            </ActivityList>
                        </Navbar.Item>
                        <Navbar.Item data-desktop-only>
                            <User.UsernameCopy username={currentUser.username} />
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
                                toggle={(
                                    <NavLink>
                                        <DropdownToggle>
                                            <CaretDownIcon name="caretDown" />
                                            <CaretUpIcon name="caretUp" />
                                        </DropdownToggle>
                                    </NavLink>
                                )}
                                menu={(
                                    <Menu>
                                        <Menu.Item>
                                            <User.Avatarless source={currentUser} />
                                        </Menu.Item>
                                        <Menu.Item as={Link} to={routes.profile()}>
                                            Settings
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item as={Link} to={routes.auth.logout()}>
                                            Sign out
                                        </Menu.Item>
                                    </Menu>
                                )}
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
    background-color: #F8F8F8;
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

const methods = {
    metamask: 'MetaMask',
    walletConnect: 'WalletConnect',
}

const UnstyledMobileNav = ({ className }) => {
    const currentUser = useSelector(selectUserData)

    const method = getMethod()

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
                                <strong>
                                    {methods[method]}
                                </strong>
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
                    <NavOverlay.Link>
                        Settings
                    </NavOverlay.Link>
                ) : (
                    <NavOverlay.Link as={Link} to={routes.profile()}>
                        Settings
                    </NavOverlay.Link>
                )}
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {currentUser ? (
                    <Button
                        tag={Link}
                        to={routes.auth.logout()}
                        kind="secondary"
                        size="normal"
                    >
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

    &[data-shadow=true] {
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.02);
    }

    ${User.Avatarless} {
        line-height: 20px;
        padding: 4px 0 8px;
    }

    ${User.Name} {
        font-size: 14px;
        margin-bottom: 4px;
    }

    ${User.Username} {
        font-size: 12px;
    }
`

const MobileNav = styled(UnstyledMobileNav)`
    ${User.UsernameCopy},
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

const UnstyledContainer = (props) => (
    <div {...props} />
)

export const Container = styled(UnstyledContainer)`
    background-color: #FFFFFF;
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

        > [data-mobile-only=true] {
            display: block;
        }

        > [data-desktop-only=true] {
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

        ${Navbar} > [data-desktop-only=true] {
            display: block;
        }

        ${Navbar} > ${HamburgerButton} {
            display: none;
        }
    }
`

const N = ({ children, shadow, ...props }) => (
    <Container {...props}>
        <DesktopNav data-shadow={!!shadow} />
        <MobileNav />
    </Container>
)

Object.assign(N, {
    Container,
    SiteSection,
})

export default N
