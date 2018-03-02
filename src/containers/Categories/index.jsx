// @flow

import {connect} from 'react-redux'

import {getCategories} from '../../modules/categories/actions'

import type { StoreState } from '../../flowtype/store-state'
import Categories from '../../components/Categories'
import type { StateProps, DispatchProps } from '../../components/Categories'
import { selectAllCategories, selectCategoriesError } from '../../modules/categories/selectors'

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        categories: selectAllCategories(state),
        error: selectCategoriesError(state),
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCategories: () => dispatch(getCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
