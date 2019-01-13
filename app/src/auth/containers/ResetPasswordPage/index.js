// @flow

import { compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import ResetPasswordPage, { type DispatchProps } from '../../components/ResetPasswordPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'
import routes from '$routes'

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    redirectToLoginPage: () => dispatch(push(routes.login())),
})

// FIXME(mariusz): `withAuthFlow` comes with additional props. Let's male it behave like `connect.

export default compose(
    connect(null, mapDispatchToProps),
    userIsNotAuthenticated,
)(withAuthFlow(ResetPasswordPage, 0, {
    password: '',
    confirmPassword: '',
    token: '',
}))
