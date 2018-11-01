// @flow

import { connect } from 'react-redux'

import type { StoreState } from '$mp/flowtype/store-state'
import LogoutPage, { type DispatchProps, type StateProps } from '../../components/LogoutPage'
import { logout } from '$mp/modules/user/actions'
import { selectLogoutError } from '$mp/modules/user/selectors'

const mapStateToProps = (state: StoreState): StateProps => ({
    error: selectLogoutError(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage)
