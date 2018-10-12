// @flow

import RegisterPage from '../../pages/RegisterPage'
import withAuthFlow from '../../shared/withAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(RegisterPage, 0, {
    name: '',
    password: '',
    confirmPassword: '',
    toc: false,
    invite: '',
}))
