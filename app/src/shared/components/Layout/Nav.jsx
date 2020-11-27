import React, { Fragment, useContext } from 'react'
import styled, { css, ThemeProvider, ThemeContext } from 'styled-components'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Nav, Menu, Button, Link as L } from '@streamr/streamr-layout'
import { MD as TABLET, LG as DESKTOP, MEDIUM } from '$shared/utils/styled'
import Link from '$shared/components/Link'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
import { selectUserData } from '$shared/modules/user/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import User from './User'
import ActivityList from '$shared/components/ActivityList'

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
                            <Translate value="general.streams" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.canvases.index()}>
                            <Translate value="general.canvases" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.dashboards.index()}>
                            <Translate value="general.dashboards" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.products.index()}>
                            <Translate value="general.products" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.subscriptions()}>
                            <Translate value="general.subscriptions" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.transactions()}>
                            <Translate value="general.transactions" />
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
                        <Translate value="general.docs" />
                    </Nav.Link>
                )}
                menu={(
                    <Menu>
                        <Menu.Item as={Link} to={docsLinks.gettingStarted}>
                            <Translate value="general.gettingStarted" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={docsLinks.streams}>
                            <Translate value="general.streams" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={docsLinks.canvases}>
                            <Translate value="general.canvases" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={docsLinks.dashboards}>
                            <Translate value="general.dashboards" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={docsLinks.products}>
                            <Translate value="general.products" />
                        </Menu.Item>
                        <Menu.Item as={Link} to={docsLinks.dataUnions}>
                            <Translate value="general.dataUnions" />
                        </Menu.Item>
                    </Menu>
                )}
            />
            {!currentUser && (
                <Fragment>
                    <Nav.Wide.Divider />
                    <Button as={Link.Raw} to={routes.auth.login()}>
                        <Translate value="general.signIn" />
                    </Button>
                    <Button.Outlined as={Link.Raw} to={routes.auth.signUp()}>
                        <Translate value="general.signUp" />
                    </Button.Outlined>
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

const SiteSection = styled.div`
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin-left: 16px;
    text-transform: uppercase;

    @media (min-width: ${TABLET}px) {
        margin-left: 24px;
    }
`

const UnstyledNarrow = (props) => {
    const current = useCurrentLocation()

    const currentUser = useSelector(selectUserData)

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
            infoComponent={(currentUser && <User.UsernameCopy username={currentUser.username} />)}
        >
            <Nav.Narrow.Body>
                <Nav.Link as={Link} to={routes.core()}>
                    <Translate value="general.core" />
                </Nav.Link>
                <Nav.Link as={Link} to={routes.marketplace.index()}>
                    <Translate value="general.marketplace" />
                </Nav.Link>
                <Nav.Link as={Link} to="/docs">
                    <Translate value="general.docs" />
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
                    <Button.Secondary as={Link.Raw} to={routes.auth.logout()}>
                        <Translate value="general.logout" />
                    </Button.Secondary>
                ) : (
                    <Fragment>
                        <Button.Primary as={Link.Raw} to={routes.auth.signUp()}>
                            <Translate value="general.signUp" />
                        </Button.Primary>
                        <div
                            css={`
                                margin-top: 20px;

                                @media (min-width: ${TABLET}px) {
                                    margin: 0 0 0 32px;
                                }
                            `}
                        >
                            Already have an account?
                            {' '}
                            <L.Primary as={Link.Raw} to={routes.auth.login()}>
                                <Translate value="general.signIn" />
                            </L.Primary>
                        </div>
                    </Fragment>
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

    ${User.UsernameCopy} {
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
    buttonColor: '#0324ff',
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
