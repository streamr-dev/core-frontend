// @flow

import React, {Component} from 'react'
import Helmet from 'react-helmet'

import styles from './app.pcss'

type Props = {}

type State = {}

export default class App extends Component<Props, State> {
    render() {
        return (
            <div className={styles.app}>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                </Helmet>
            </div>
        )
    }
}