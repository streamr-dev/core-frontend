import React, { Fragment, FunctionComponent, HTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Accordion, AccordionItem } from 'reactstrap'
import { Button, HamburgerButton, Logo, NavOverlay } from '@streamr/streamr-layout'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { truncate } from '~/shared/utils/text'
import { connectModal } from '~/modals/ConnectModal'
import { useEns, useWalletAccount } from '~/shared/stores/wallet'
import toast from '~/utils/toast'
import Popover from '~/shared/components/Popover'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import routes from '~/routes'
import { Avatarless, Name, Username } from './User'
import {
    Avatar,
    LogoLink,
    Menu,
    MenuDivider,
    MenuGrid,
    MenuItem,
    MenuItemAvatarContainer,
    MOBILE_LG,
    Navbar,
    NavbarItem,
    NavbarItemAccount,
    NavbarLinkDesktop,
    NavbarLinkMobile,
    NavLink,
    NetworkMobileLink,
    NetworkNavElement,
    SignedInUserMenu,
    StyledAccordionBody,
    StyledAccordionHeader,
    UserInfoMobile,
    WalletAddress,
} from './Nav.styles'

const extendedNetworkNav: {
    title: string
    subtitle: string
    link: string
    rel?: string
    target?: string
}[] = [
    {
        title: 'Overview',
        subtitle: 'Your activity on one glance',
        link: routes.network.overview(),
    },
    {
        title: 'Sponsorships',
        subtitle: 'Explore, create and join Sponsorships',
        link: routes.network.sponsorships(),
    },
    {
        title: 'Operators',
        subtitle: 'Explore Operators and delegate',
        link: routes.network.operators(),
    },
]

const networkLinks = [
    routes.network.overview(),
    routes.network.sponsorships(),
    routes.network.sponsorship(),
    routes.network.operators(),
]
const isNetworkTabActive = (path: string): boolean => {
    return networkLinks.reduce((previousValue, currentValue) => {
        const isNetworkLink = path.startsWith(currentValue)
        return previousValue || isNetworkLink
    }, false)
}

const UnstyledDesktopNav: FunctionComponent = (props) => {
    const { pathname } = useLocation()

    const account = useWalletAccount()

    const ensName = useEns(account)

    const navigate = useNavigate()

    return (
        <div {...props} data-testid={'desktop-nav'}>
            <Navbar>
                <NavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo data-testid={'logo'} />
                    </LogoLink>
                </NavbarItem>
                <MenuGrid data-desktop-only>
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
                        <NavbarLinkDesktop highlight={isNetworkTabActive(pathname)}>
                            <Popover
                                title={<NavLink>Network</NavLink>}
                                caret={false}
                                menuProps={{ className: 'nav-dropdown' }}
                                openOnHover
                            >
                                {extendedNetworkNav.map((networkNavElement) => {
                                    const { title, subtitle, link } = networkNavElement

                                    return (
                                        <PopoverItem
                                            key={link}
                                            onClick={() => void navigate(link)}
                                        >
                                            <NetworkNavElement>
                                                <p className="title">{title}</p>
                                                <p className="subtitle">{subtitle}</p>
                                            </NetworkNavElement>
                                        </PopoverItem>
                                    )
                                })}
                            </Popover>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                </MenuGrid>
                {!account && (
                    <Fragment>
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
                    </Fragment>
                )}
                {!!account && (
                    <Fragment>
                        <NavbarItemAccount>
                            <SignedInUserMenu
                                edge
                                alignMenu="right"
                                nodeco
                                toggle={<Avatar username={account} />}
                                menu={
                                    <Menu>
                                        <MenuItem className={'user-info'}>
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
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            className="disconnect"
                                            onClick={() => {
                                                toast({
                                                    title: 'Use the "Lock" button in your wallet.',
                                                })
                                            }}
                                        >
                                            <div className={'disconnect-text'}>
                                                <span>Disconnect</span>
                                                <SvgIcon name={'disconnect'} />
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

const UnstyledMobileNav: FunctionComponent<{ className?: string }> = ({ className }) => {
    const account = useWalletAccount()

    const { pathname } = useLocation()

    const [accordionOpen, setAccordionOpen] = useState<string>('')
    const toggle = (id) => {
        if (accordionOpen === id) {
            setAccordionOpen('')
        } else {
            setAccordionOpen(id)
        }
    }

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
                <NavbarLinkMobile highlight={isNetworkTabActive(pathname)}>
                    <NavLink as="div">
                        <Accordion
                            flush
                            open={accordionOpen}
                            // hack for the issues with typing
                            {...{
                                toggle,
                            }}
                        >
                            <AccordionItem>
                                <StyledAccordionHeader targetId="1">
                                    <div className="network-dropdown-button-inner">
                                        Network
                                        <SvgIcon
                                            name="caretDown"
                                            className={
                                                'caret-down ' +
                                                (accordionOpen ? 'is-open' : '')
                                            }
                                        />
                                    </div>
                                </StyledAccordionHeader>
                                <StyledAccordionBody accordionId="1">
                                    {extendedNetworkNav.map(
                                        (networkNavElement, index) => {
                                            const { title, subtitle, link, ...rest } =
                                                networkNavElement
                                            return (
                                                <NetworkMobileLink
                                                    to={link}
                                                    {...rest}
                                                    key={index}
                                                >
                                                    <NetworkNavElement>
                                                        <p className="title">{title}</p>
                                                        <p className="subtitle">
                                                            {subtitle}
                                                        </p>
                                                    </NetworkNavElement>
                                                </NetworkMobileLink>
                                            )
                                        },
                                    )}
                                </StyledAccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </NavLink>
                </NavbarLinkMobile>
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
