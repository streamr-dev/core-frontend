// @flow

import ForgotPasswordPage from '../../components/ForgotPasswordPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(ForgotPasswordPage, 0, {
    email: '',
}))
