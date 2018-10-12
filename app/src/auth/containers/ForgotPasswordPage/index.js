// @flow

import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import withAuthFlow from '../../shared/withAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(ForgotPasswordPage, 0, {
    email: '',
}))
