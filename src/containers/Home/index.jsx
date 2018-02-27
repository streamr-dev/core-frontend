// @flow
import React from 'react'
import { connect } from 'react-redux'

import Dropdown from '../../Components/Dropdown'
import type {DropdownOptions} from '../../Components/Dropdown'
import Products from '../Products'
import { selectFetchingCategories, selectAllCategories } from '../Categories/selectors'
import { getCategories } from '../Categories/actions'
import type {StoreState} from '../../flowtype/store-state'
import type {Category} from '../../flowtype/category-types'

type StateProps = {
    fetchingCategories: boolean,
    categories: Array<Category>,
}

type DispatchProps = {
    getCategories: () => void,
}

type Props = StateProps & DispatchProps
type State = {}

class Home extends React.Component<Props, State> {
    componentDidMount() {
        this.props.getCategories()
    }

    render() {
        const {fetchingCategories, categories} = this.props

        const categoryOptions: DropdownOptions = !fetchingCategories ? categories.reduce((result: DropdownOptions, category: Category): DropdownOptions => ({
            ...result,
            [category.id]: category.name,
        }), {}) : {}

        return (
            <div>
                {!fetchingCategories && (
                    <Dropdown options={categoryOptions} />
                )}
                <Products />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    fetchingCategories: selectFetchingCategories(state),
    categories: selectAllCategories(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCategories: () => dispatch(getCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
