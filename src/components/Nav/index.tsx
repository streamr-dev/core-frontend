import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Button, HamburgerButton, Logo, NavOverlay } from '@streamr/streamr-layout'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { truncate } from '~/shared/utils/text'
import { connectModal } from '~/modals/ConnectModal'
import { useEns, useWalletAccount } from '~/shared/stores/wallet'
import toast from '~/utils/toast'
import routes from '~/routes'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import { saveOperator } from '~/utils'
import { useMediaQuery } from '~/hooks'
import { ChainSelector as UnstyledChainSelector } from '~/components/ChainSelector'
import { Avatarless, Name, Username } from './User'
import {
    Avatar,
    LogoLink,
    Menu,
    MenuDivider,
    MenuGrid,
    MenuItemAvatarContainer,
    MOBILE_LG,
    Navbar,
    NavbarItem,
    NavbarItemAccount,
    NavbarLinkDesktop,
    NavbarLinkMobile,
    NavLink,
    SignedInUserMenu,
    TextMenuItem,
    UserInfoMenuItem,
    UserInfoMobile,
    WalletAddress,
} from './Nav.styles'
import { Dropdown } from './NetworkDropdown'
import { NetworkAccordion } from './NetworkAccordion'

const UnstyledDesktopNav: FunctionComponent = (props) => {
    const { pathname } = useLocation()

    const account = useWalletAccount()

    const ensName = useEns(account)

    const navigate = useNavigate()

    const operatorQuery = useOperatorForWalletQuery(account)

    const { data: operator = null, isFetching: isOperatorFetching } = operatorQuery

    const isMobile = !useMediaQuery(`only screen and ${TABLET}`)

    return (
        <div {...props} data-testid={'desktop-nav'}>
            <Navbar>
                <NavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo data-testid={'logo'} />
                    </LogoLink>
                </NavbarItem>
                <ChainSelector data-mobile-only menuAlignment="left" />
                <MenuGrid data-desktop-only>
                    <div />
                    <NavbarItem>
                        <NavbarLinkDesktop
                            highlight={pathname.startsWith(routes.projects.index())}
                        >
                            <NavLink as={Link} to={routes.projects.index()}>
                                Projects
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarLinkDesktop
                            highlight={pathname.startsWith(routes.streams.index())}
                        >
                            <NavLink as={Link} to={routes.streams.index()}>
                                Streams
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <Dropdown />
                    </NavbarItem>
                    <ChainSelector menuAlignment="right" />
                </MenuGrid>
                {!account && (
                    <NavbarItemAccount>
                        <Button
                            kind="primary"
                            size="mini"
                            outline
                            type="button"
                            onClick={async () => {
                                try {
                                    await connectModal.pop()
                                } catch (e) {
                                    console.warn('Wallet connecting failed', e)
                                }
                            }}
                        >
                            Connect
                        </Button>
                    </NavbarItemAccount>
                )}
                {!!account && (
                    <NavbarItemAccount>
                        <SignedInUserMenu
                            edge
                            alignMenu="right"
                            nodeco
                            toggle={<Avatar username={account} />}
                            menu={
                                <Menu>
                                    <UserInfoMenuItem>
                                        <MenuItemAvatarContainer>
                                            <Avatar username={account} />
                                            <WalletAddress>
                                                {!!ensName && (
                                                    <span className={'ens-name'}>
                                                        {truncate(ensName)}
                                                    </span>
                                                )}
                                                <span>{truncate(account)}</span>
                                            </WalletAddress>
                                        </MenuItemAvatarContainer>
                                    </UserInfoMenuItem>
                                    {isMobile && (
                                        <>
                                            <MenuDivider />
                                            {operator ? (
                                                <TextMenuItem
                                                    onClick={() => {
                                                        navigate(
                                                            routes.network.operator({
                                                                id: operator.id,
                                                            }),
                                                        )
                                                    }}
                                                >
                                                    <span>My Operator</span>
                                                </TextMenuItem>
                                            ) : (
                                                <TextMenuItem
                                                    disabled={isOperatorFetching}
                                                    onClick={() => {
                                                        if (isOperatorFetching) {
                                                            return
                                                        }

                                                        saveOperator(undefined, {
                                                            onDone(id) {
                                                                navigate(
                                                                    routes.network.operator(
                                                                        {
                                                                            id,
                                                                        },
                                                                    ),
                                                                )
                                                            },
                                                        })
                                                    }}
                                                >
                                                    <span>Become an Operator</span>
                                                </TextMenuItem>
                                            )}
                                        </>
                                    )}
                                    <MenuDivider />
                                    <TextMenuItem
                                        onClick={() => {
                                            toast({
                                                title: 'Use the "Lock" button in your wallet.',
                                            })
                                        }}
                                    >
                                        <span>Disconnect</span>
                                        <SvgIcon name="disconnect" />
                                    </TextMenuItem>
                                </Menu>
                            }
                        />
                    </NavbarItemAccount>
                )}
                <HamburgerButton idle />
            </Navbar>
        </div>
    )
}

const UnstyledMobileNav: FunctionComponent<{ className?: string }> = ({ className }) => {
    const account = useWalletAccount()

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
                {!!account && (
                    <UserInfoMobile>
                        <Avatar username={account} />
                        <Avatarless data-testid={'avatarless'} source={account} />
                    </UserInfoMobile>
                )}
                <NavbarLinkMobile
                    highlight={pathname.startsWith(routes.projects.index())}
                >
                    <NavLink as={Link} to={routes.projects.index()}>
                        Projects
                    </NavLink>
                </NavbarLinkMobile>
                <NavbarLinkMobile highlight={pathname.startsWith(routes.streams.index())}>
                    <NavLink as={Link} to={routes.streams.index()}>
                        Streams
                    </NavLink>
                </NavbarLinkMobile>
                <NetworkAccordion />
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {!!account ? (
                    <Button
                        kind="secondary"
                        size="normal"
                        type="button"
                        onClick={() => {
                            toast({
                                title: 'Use the "Lock" button in your wallet.',
                            })
                        }}
                    >
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={async () => {
                            try {
                                await connectModal.pop()
                            } catch (e) {
                                console.warn('Wallet connecting failed', e)
                            }
                        }}
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

    @media (${DESKTOP}) {
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

        > :first-child {
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

export const NavContainer = styled.div`
    background-color: #ffffff;
    color: #323232;

    ${HamburgerButton} {
        background-color: #f8f8f8;
    }

    ${Navbar} {
        padding: 20px 24px;

        @media (${TABLET}) {
            padding: 20px 24px;
        }

        @media (${DESKTOP}) {
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

    @media (${TABLET}) {
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

const ChainSelector = styled(UnstyledChainSelector)`
    justify-self: right;

    &[data-desktop-only='true'] {
        display: none;
    }

    &[data-mobile-only='true'] {
        display: block;
        justify-self: left;
    }

    @media (${TABLET}) {
        &[data-desktop-only='true'] {
            display: block;
            justify-self: right;
        }

        &[data-mobile-only='true'] {
            display: none;
        }
    }
`

interface NProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    shadow?: boolean
}

function N({ shadow = false, ...props }: NProps) {
    return (
        <NavContainer {...props}>
            <DesktopNav data-shadow={!!shadow} />
            <MobileNav />
        </NavContainer>
    )
}

Object.assign(N, {
    Container: NavContainer,
})

export default N
