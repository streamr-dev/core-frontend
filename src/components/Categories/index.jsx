// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values} from 'lodash'

import {getCategories} from '../../actions/CategoryActions'

import type {Category} from '../../flowtype/category-types'
import type {CategoryState} from '../../flowtype/states/category-state'

type StateProps = {
    categories: Array<Category>
}

type DispatchProps = {
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
                {this.props.categories.map(c => (
                    <div key={c.id}>
                        {JSON.stringify(c)}
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = ({category}: {category: CategoryState}): StateProps => ({
    // Using lodash since flow is having some problem with Object.values
    categories: values(category.byId)
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCategories() {
        dispatch(getCategories())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Categories)