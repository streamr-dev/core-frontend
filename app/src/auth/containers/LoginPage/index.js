// @flow

import LoginPage from '../../components/LoginPage'
import withAuthFlow from '../WithAuthFlow'
import withSession from '../WithSession'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withSession(withAuthFlow(LoginPage, 0, {
    email: '',
    password: '',
    rememberMe: false,
})))
