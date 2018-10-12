// @flow

import SignupPage from '../../pages/SignupPage'
import withAuthFlow from '../../shared/withAuthFlow'

export default withAuthFlow(SignupPage, 0, {
    email: '',
})
