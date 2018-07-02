// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './nav.pcss'
import NavLogo from './NavLogo'
import NavHamburger from './NavHamburger'
import NavItem from './NavItem'

type Props = {
    children: Node,
    expand?: boolean,
    opaque?: boolean,
    overlay?: boolean,
    label?: string,
}

type State = {
    open: boolean,
}

const toggleBodyClass = (className, state) => {
    if (document.body) {
        const { classList } = document.body
        if (state) {
            classList.add(className)
        } else {
            classList.remove(className)
        }
    }
}

class Nav extends React.Component<Props, State> {
    state = {
        open: false,
    }

    onToggleClick = (e: SyntheticInputEvent<EventTarget>) => {
        const open = !this.state.open

        e.preventDefault()
        this.setState({
            open,
        })
        toggleBodyClass('no-scroll', open)
    }

    onClose = () => {
        this.setState({
            open: false,
        })
        toggleBodyClass('no-scroll', false)
    }

    render() {
        const { open } = this.state
        const {
            children,
            expand,
            opaque,
            overlay,
            label,
        } = this.props

        return (
            <nav
                className={classNames(styles.nav, {
                    [styles.opaque]: opaque,
                    [styles.open]: open,
                    [styles.fullWidth]: expand,
                    [styles.overlay]: overlay,
                })}
            >
                <div className="container">
                    <div className={styles.inner}>
                        <NavLogo />
                        {!!label && (
                            <div className={classNames(styles.marketplaceLabel, 'hidden-md-up')}>
                                {label}
                            </div>
                        )}
                        <NavHamburger onClick={this.onToggleClick} opaqueNav={opaque} />
                        <div className={styles.navItemsWrapper}>
                            <div className={styles.toggleWrapper}>
                                <div className="container">
                                    <NavHamburger open onClick={this.onToggleClick} />
                                </div>
                            </div>
                            <ul className={styles.navItems}>
                                {React.Children.map(children, (child) => child && (
                                    <NavItem opaqueNav={opaque}>
                                        {React.cloneElement(child, {
                                            closeNav: this.onClose,
                                        })}
                                    </NavItem>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Nav
