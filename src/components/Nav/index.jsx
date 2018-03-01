// @flow

import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { Container } from '@streamr/streamr-layout'

import styles from './nav.pcss'
import links from '../../links.json'

export default class Nav extends Component<{}> {
    render() {
        return (
            <nav className={styles.nav}>
                <Container>
                    <div className="nav-item">
                        <Link to={links.streamrSite}>Top</Link>
                    </div>
                    <div className="nav-item">
                        <Link to={links.main}>Marketplace</Link>
                    </div>
                    <div className="nav-item">
                        <Link to={links.faq}>FAQ</Link>
                    </div>
                </Container>
            </nav>
        )
    }
}
