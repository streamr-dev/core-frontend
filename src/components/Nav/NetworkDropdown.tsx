import React, { ComponentProps, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { NavLink, NavbarLinkDesktop } from '~/components/Nav/Nav.styles'
import { DefaultSimpleDropdownMenu, SimpleDropdown } from '~/components/SimpleDropdown'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import { COLORS } from '~/shared/utils/styled'

export function Dropdown() {
    const [isOpen, setIsOpen] = useState(false)

    const { pathname } = useLocation()

    const timeoutRef = useRef<number | undefined>()

    function clear() {
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current)
        }
    }

    function show(toggle: (value: boolean) => void) {
        clear()

        toggle(true)
    }

    function hide(toggle: (value: boolean) => void, { immediately = false } = {}) {
        clear()

        if (immediately) {
            return void toggle(false)
        }

        timeoutRef.current = window.setTimeout(() => {
            toggle(false)
        }, 250)
    }

    return (
        <NavbarLinkDesktop highlight={isOpen || isNetworkTabActive(pathname)}>
            <SimpleDropdown
                onToggle={setIsOpen}
                menu={(toggle) => (
                    <Menu
                        onMouseEnter={() => void show(toggle)}
                        onMouseLeave={() => void hide(toggle)}
                    >
                        {NetworkNavItems.map((i) => (
                            <DropdownItem
                                key={i.link}
                                to={i.link}
                                onFocus={() => void show(toggle)}
                                onClick={() => void hide(toggle, { immediately: true })}
                            >
                                <strong>{i.title}</strong>
                                <Subtitle>{i.subtitle}</Subtitle>
                            </DropdownItem>
                        ))}
                    </Menu>
                )}
            >
                {(toggle) => (
                    <NavLink
                        as={Link}
                        to={routes.network.overview()}
                        onFocus={() => void show(toggle)}
                        onBlur={() => void hide(toggle)}
                        onMouseEnter={() => void show(toggle)}
                        onMouseLeave={() => void hide(toggle)}
                        onClick={(e) => void e.preventDefault()}
                    >
                        Network
                    </NavLink>
                )}
            </SimpleDropdown>
        </NavbarLinkDesktop>
    )
}

const networkLinks = [
    routes.network.overview(),
    routes.network.sponsorships(),
    routes.network.sponsorship(),
    routes.network.operators(),
]

export const isNetworkTabActive = (path: string): boolean => {
    return networkLinks.reduce((previousValue, currentValue) => {
        const isNetworkLink = path.startsWith(currentValue)
        return previousValue || isNetworkLink
    }, false)
}

const Menu = styled(DefaultSimpleDropdownMenu)`
    padding-left: 0;
    padding-right: 0;
`

export const NetworkNavItems: {
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

const Subtitle = styled.div`
    color: ${COLORS.primaryLight};
`

function getTickIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'tick',
    }
}

const TickIcon = styled(SvgIcon).attrs(getTickIconAttrs)`
    width: 10px;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 10px;
`

function getDropdownItemAttrs(props: any): ComponentProps<typeof Link> {
    return {
        ...props,
        children: (
            <>
                <div>{props.children}</div>
                {props.active && <TickIcon />}
            </>
        ),
    }
}

const DropdownItem = styled(Link).attrs(getDropdownItemAttrs)<{ active?: boolean }>`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    line-height: 28px;
    padding: 12px 32px;
    position: relative;

    &,
    :hover,
    :visited,
    :link {
        color: #000000;
    }

    :focus,
    :hover {
        background-color: #e9ecef;
    }

    &[disabled] {
        color: #adadad;
    }

    :focus {
        outline: none;
        box-shadow: inset 0 0 0 1.5px var(--focus-border-color);
    }

    :active {
        background-color: ${COLORS.primary};
        color: #ffffff;
    }

    :active ${Subtitle} {
        color: ${COLORS.radioBorder};
    }
`
