// @flow

import LoginPage from '../../components/LoginPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(LoginPage, 0, {
    email: '',
    password: '',
    rememberMe: false,
}))
