// @flow
import React from 'react'
import { connect } from 'react-redux'

import Dropdown from '../../Components/Dropdown'
import SearchField from '../../Components/SearchField'
import type {DropdownOptions} from '../../Components/Dropdown'
import Products from '../Products'
import { selectFetchingCategories, selectAllCategories } from '../../modules/categories/selectors'
import { selectSearchText } from '../../modules/products/selectors'
import { getCategories } from '../../modules/categories/actions'
import { updateSearchText, updateCategory } from '../../modules/products/actions'
import type {StoreState} from '../../flowtype/store-state'
import type {Category} from '../../flowtype/category-types'

type StateProps = {
    fetchingCategories: boolean,
    categories: Array<Category>,
    searchText: string,
}

type DispatchProps = {
    getCategories: () => void,
    onSearchFieldChange: (string) => void,
    onDoSearch: () => void,
    onSelectCategory: (category: ?string) => void,
}

type Props = StateProps & DispatchProps
type State = {}

class Home extends React.Component<Props, State> {
    componentDidMount() {
        this.props.getCategories()
    }

    render() {
        const { fetchingCategories, categories, searchText, onSearchFieldChange, onDoSearch, onSelectCategory } = this.props

        const categoryOptions: DropdownOptions = !fetchingCategories ? categories.reduce((result: DropdownOptions, category: Category): DropdownOptions => ({
            ...result,
            [category.id]: category.name,
        }), {}) : {}

        return (
            <div>
                <SearchField value={searchText} onChange={onSearchFieldChange} onSearch={onDoSearch} />
                {!fetchingCategories && (
                    <Dropdown options={categoryOptions} onSelect={(category: ?string) => onSelectCategory(category)} />
                )}
                <Products />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    fetchingCategories: selectFetchingCategories(state),
    categories: selectAllCategories(state),
    searchText: selectSearchText(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCategories: () => dispatch(getCategories()),
    onSearchFieldChange: (text) => dispatch(updateSearchText(text)),
    onDoSearch: () => alert('as'),
    onSelectCategory: (category: ?string) => dispatch(updateCategory(category)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
