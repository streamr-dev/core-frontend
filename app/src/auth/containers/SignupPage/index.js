// @flow

import SignupPage from '../../pages/SignupPage'
import withAuthFlow from '../../shared/withAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(SignupPage, 0, {
    email: '',
}))
