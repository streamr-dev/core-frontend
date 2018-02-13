// @flow

import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import styles from './nav.pcss'

type Props = {}

type State = {}

export default class Nav extends Component<Props, State> {
    render() {
        return (
            <ul className={styles.nav}>
                <li><Link to="page1">Page 1</Link></li>
                <li><Link to="page2">Page 2</Link></li>
            </ul>
        )
    }
}