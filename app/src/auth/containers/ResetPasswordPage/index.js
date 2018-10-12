// @flow

import ResetPasswordPage from '../../pages/ResetPasswordPage'
import withAuthFlow from '../../shared/withAuthFlow'

export default withAuthFlow(ResetPasswordPage, 0, {
    password: '',
    confirmPassword: '',
    token: '',
})
