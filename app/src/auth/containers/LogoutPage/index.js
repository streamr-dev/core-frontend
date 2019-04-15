// @flow

import { connect } from 'react-redux'
import { compose } from 'redux'

import LogoutPage, { type DispatchProps } from '$auth/components/LogoutPage'
import { logout } from '$shared/modules/user/actions'
import withSession from '$auth/containers/WithSession'

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    logout: () => dispatch(logout()),
})

export default compose(
    connect(null, mapDispatchToProps),
    withSession,
)(LogoutPage)
