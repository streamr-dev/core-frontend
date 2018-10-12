// @flow

import ResetPasswordPage from '../../pages/ResetPasswordPage'
import withAuthFlow from '../../shared/withAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(ResetPasswordPage, 0, {
    password: '',
    confirmPassword: '',
    token: '',
}))
