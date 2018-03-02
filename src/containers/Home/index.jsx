// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Container } from '@streamr/streamr-layout'

import Dropdown from '../../Components/Dropdown'
import type {DropdownOptions} from '../../Components/Dropdown'
import Products from '../Products'
import { selectFetchingCategories, selectAllCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import type {StoreState} from '../../flowtype/store-state'
import type {Category, CategoryList} from '../../flowtype/category-types'

type StateProps = {
    fetchingCategories: boolean,
    categories: CategoryList,
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
            <Container>
                {!fetchingCategories && (
                    <Dropdown options={categoryOptions} />
                )}
                <Products />
            </Container>
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
