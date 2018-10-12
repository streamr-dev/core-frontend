// @flow

import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import withAuthFlow from '../../shared/withAuthFlow'

export default withAuthFlow(ForgotPasswordPage, 0, {
    email: '',
})
