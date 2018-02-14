// @flow

import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import styles from './nav.pcss'
import links from '../../links.json'

type Props = {}

type State = {}

export default class Nav extends Component<Props, State> {
    render() {
        return (
            <ul className={styles.nav}>
                <li>
                    <Link to={links.home}>Page 1</Link>
                </li>
                <li>
                    <Link to={links.products}>Page 2</Link>
                </li>
            </ul>
        )
    }
}
