// @flow

import React, {Component} from 'react'

import type {Category} from '../../flowtype/category-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type StateProps = {
    categories: Array<Category>,
    error: ?ErrorInUi
}

export type DispatchProps = {
    getCategories: () => void
}

type Props = StateProps & DispatchProps

type State = {}

import styles from './categories.pcss'

export class Categories extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()
    }

    render() {
        return (
            <div className={styles.products}>
                Categories
                {this.props.error && (
                    <div style={{
                        background: 'red'
                    }}>
                        {this.props.error.message}
                    </div>
                )}
                {this.props.categories.map(c => (
                    <div key={c.id}>
                        {JSON.stringify(c)}
                    </div>
                ))}
            </div>
        )
    }
}

export default Categories
