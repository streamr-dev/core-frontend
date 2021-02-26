import React, { Fragment, useContext } from 'react'
import styled, { css, ThemeProvider, ThemeContext } from 'styled-components'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Nav, Menu, Button } from '@streamr/streamr-layout'
import { MD as TABLET, LG as DESKTOP } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import { DocsMenu } from '$docs/components/DocsLayout/DocsNav'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
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

const SignedInUserMenu = styled(Nav.Wide.Dropdown)`
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

const UnstyledWide = (props) => {
    const current = useCurrentLocation()

    const currentUser = useSelector(selectUserData)

    return (
        <Nav.Wide
            {...props}
            logoComponent={(
                <Nav.LogoItem href={routes.root()} />
            )}
        >
            <Nav.Wide.Dropdown
                highlight={current === 'core'}
                toggle={(
                    <Nav.Link>
                        <Translate value="general.core" />
                    </Nav.Link>
                )}
                menu={(
                    <Menu>
                        <Menu.Item as={Link} to={routes.streams.index()}>
                            Streams
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.canvases.index()}>
                            Canvases
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.dashboards.index()}>
                            Dashboards
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.products.index()}>
                            Products
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
            <Nav.Wide.Dropdown
                highlight={current === 'marketplace'}
                toggle={(
                    <Nav.Link as={Link} to={routes.marketplace.index()}>
                        <Translate value="general.marketplace" />
                    </Nav.Link>
                )}
            />
            <Nav.Wide.Dropdown
                highlight={current === 'docs'}
                toggle={(
                    <Nav.Link>
                        Docs
                    </Nav.Link>
                )}
                menu={(
                    <DocsMenu />
                )}
            />
            {!currentUser && (
                <Fragment>
                    <Nav.Wide.Divider />
                    <Button tag="a" href={routes.auth.login()} kind="primary" size="mini" outline>
                        Use Core
                    </Button>
                </Fragment>
            )}
            {!!currentUser && (
                <Fragment>
                    <ActivityList>
                        <Nav.Wide.Dropdown
                            alignMenu="right"
                            nodeco
                            toggle={(
                                <Nav.Link>
                                    <SvgIcon
                                        name="alarmBell"
                                        // eslint-disable-next-line react/jsx-curly-brace-presence
                                        css={`
                                                height: 20px;
                                                width: 16px;
                                        `}
                                    />
                                </Nav.Link>
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
                    <User.UsernameCopy username={currentUser.username} />
                    <SignedInUserMenu
                        edge
                        alignMenu="right"
                        nodeco
                        toggle={(
                            <Nav.Link>
                                <DropdownToggle>
                                    <CaretDownIcon name="caretDown" />
                                    <CaretUpIcon name="caretUp" />
                                </DropdownToggle>
                            </Nav.Link>
                        )}
                        menu={(
                            <Menu>
                                <Menu.Item>
                                    <User.Avatarless source={currentUser} />
                                </Menu.Item>
                                <Menu.Item as={Link} to={routes.profile()}>
                                    <Translate value="general.settings" />
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item as={Link} to={routes.auth.logout()}>
                                    <Translate value="general.logout" />
                                </Menu.Item>
                            </Menu>
                        )}
                    />
                </Fragment>
            )}
        </Nav.Wide>
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

const UnstyledNarrow = (props) => {
    const current = useCurrentLocation()

    const currentUser = useSelector(selectUserData)

    const method = getMethod()

    return (
        <Nav.Narrow
            {...props}
            logoComponent={(
                <Fragment>
                    <Nav.LogoItem href={routes.root()} />
                    <SiteSection>
                        {current}
                    </SiteSection>
                </Fragment>
            )}
            altLogoComponent={(
                <Nav.LogoItem href={routes.root()} />
            )}
            infoComponent={(currentUser && (
                <ConnectedWith>
                    <span>&zwnj;</span>
                    <img src={icons[method]} alt="" />
                    <strong>
                        {methods[method]}
                    </strong>
                </ConnectedWith>
            ))}
        >
            <Nav.Narrow.Body>
                <Nav.Link as={Link} to={routes.core()}>
                    <Translate value="general.core" />
                </Nav.Link>
                <Nav.Link as={Link} to={routes.marketplace.index()}>
                    <Translate value="general.marketplace" />
                </Nav.Link>
                <Nav.Link as={Link} to="/docs">
                    Docs
                </Nav.Link>
                {!currentUser ? (
                    <Nav.Link>
                        <Translate value="general.settings" />
                    </Nav.Link>
                ) : (
                    <Nav.Link as={Link} to={routes.profile()}>
                        <Translate value="general.settings" />
                    </Nav.Link>
                )}
            </Nav.Narrow.Body>
            <Nav.Narrow.Footer>
                {currentUser ? (
                    <Button tag="a" href={routes.auth.logout()} kind="secondary" size="normal">
                        <Translate value="general.logout" />
                    </Button>
                ) : (
                    <Button tag="a" href={routes.auth.login()} kind="primary" size="normal">
                        Use Core
                    </Button>
                )}
            </Nav.Narrow.Footer>
        </Nav.Narrow>
    )
}

const Wide = styled(UnstyledWide)`
    ${({ theme }) => !!theme.navShadow && css`
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.02);
    `}

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

    ${User.UsernameCopy} + ${SignedInUserMenu} {
        margin-left: 0;
    }
`

const Narrow = styled(UnstyledNarrow)`
    ${Nav.Narrow.Body} {
        padding-top: 96px;
    }

    ${User.UsernameCopy},
    ${ConnectedWith} {
        margin-right: 16px;
    }

    ${Nav.Link}:not([href]) {
        color: #cdcdcd;
    }

    @media (min-width: ${TABLET}px) {
        ${User} {
            padding: 16px 64px 48px 64px;
        }
    }
`

const lightTheme = {
    backgroundColor: '#ffffff',
    color: '#323232',
}

const UnstyledN = ({ noWide, noNarrow, ...props }) => {
    const theme = useContext(ThemeContext) || {}

    return !noWide && !noNarrow && (
        <div {...props}>
            <ThemeProvider theme={theme.dark ? {} : lightTheme}>
                {!noWide && <Wide />}
                {!noNarrow && <Narrow />}
            </ThemeProvider>
        </div>
    )
}

const N = styled(UnstyledN)`
    ${Wide} {
        display: none;
    }

    @media (min-width: ${DESKTOP}px) {
        ${Narrow} {
            display: none;
        }

        ${Wide} {
            display: flex;
        }
    }
`

Object.assign(N, {
    Wide,
    Narrow,
    SiteSection,
})

export default N
