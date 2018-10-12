// @flow

import LoginPage from '../../pages/LoginPage'
import withAuthFlow from '../../shared/withAuthFlow'

export default withAuthFlow(LoginPage, 0, {
    email: '',
    password: '',
    rememberMe: false,
})
