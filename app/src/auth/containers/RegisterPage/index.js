// @flow

import RegisterPage from '../../components/RegisterPage'
import withAuthFlow from '../WithAuthFlow'
import withSession from '../WithSession'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withSession(withAuthFlow(RegisterPage, 0, {
    name: '',
    password: '',
    confirmPassword: '',
    toc: false,
    invite: '',
})))
