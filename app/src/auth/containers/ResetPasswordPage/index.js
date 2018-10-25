// @flow

import ResetPasswordPage from '../../components/ResetPasswordPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(ResetPasswordPage, 0, {
    password: '',
    confirmPassword: '',
    token: '',
}))
