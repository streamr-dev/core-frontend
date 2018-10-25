// @flow

import RegisterPage from '../../components/RegisterPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(RegisterPage, 0, {
    name: '',
    password: '',
    confirmPassword: '',
    toc: false,
    invite: '',
}))
