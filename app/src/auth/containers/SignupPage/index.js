// @flow

import SignupPage from '../../components/SignupPage'
import withAuthFlow from '../WithAuthFlow'
import { userIsNotAuthenticated } from '$mp/utils/auth'

export default userIsNotAuthenticated(withAuthFlow(SignupPage, 0, {
    email: '',
}))
