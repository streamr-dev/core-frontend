// @flow

import React, { Component } from 'react'
import { Breadcrumb, ButtonDropdown } from 'reactstrap'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom'

import type { Node } from 'react'

type Children = string | Node | Array<Node>

import styles from './breadcrumb.pcss'

export class StreamrBreadcrumb extends Component<{
    children?: Children
}> {
    render() {
        return (
            <Breadcrumb className={styles.breadcrumb}>
                {this.props.children}
            </Breadcrumb>
        )
    }
}

export class StreamrBreadcrumbItem extends Component<{
    href?: string,
    active?: boolean,
    children?: Children
}> {
    render() {
        const { href, children, active } = this.props
        if (active) {
            return <li className="active"><span>{children}</span></li>
        }

        return (
            <li>
                <Link to={href}>
                    {children}
                </Link>
            </li>
        )
    }
}

export class StreamrBreadcrumbDropdownButton extends Component<{
    className?: string,
        children?: Children
}> {
    render() {
        return (
            <div className={styles.streamrDropdownContainer}>
                <ButtonDropdown
                    id={`streamrDropdownButton-${Date.now()}`}
                    {...this.props}
                    className={`${this.props.className || ''} ${styles.streamrDropdownButton}`}
                    toggle={() => {}}
                >
                    {this.props.children}
                </ButtonDropdown>
            </div>
        )
    }
}

export class StreamrBreadcrumbToolbar extends Component<{
    children?: Children
}> {
    render() {
        return (
            <div className={styles.toolbar}>
                {this.props.children}
            </div>
        )
    }
}

export class StreamrBreadcrumbToolbarButton extends Component<{
    iconName: string,
    onClick: Function
}> {
    render() {
        return (
            <button className={styles.button} type="button" onClick={this.props.onClick}>
                <FontAwesome name={this.props.iconName} />
            </button>
        )
    }
}
