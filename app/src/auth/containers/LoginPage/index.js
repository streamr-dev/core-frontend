// @flow

import LoginPage from '../../pages/LoginPage'
import withAuthFlow from '../../shared/withAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(LoginPage, 0, {
    email: '',
    password: '',
    rememberMe: false,
}))
