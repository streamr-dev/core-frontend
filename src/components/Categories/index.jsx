// @flow

import React, {Component} from 'react'

import type {CategoryList} from '../../flowtype/category-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type StateProps = {
    categories: CategoryList,
    error: ?ErrorInUi
}

export type DispatchProps = {
    getCategories: () => void
}

type Props = StateProps & DispatchProps

type State = {}

export class Categories extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()
    }

    render() {
        return (
            <div>
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
