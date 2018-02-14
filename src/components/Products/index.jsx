// @flow

import React, {Component} from 'react'

type Props = {}

type State = {}

import styles from './products.pcss'

export default class Products extends Component<Props, State> {
    render() {
        return (
            <div className={styles.products}/>
        )
    }
}