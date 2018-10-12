// @flow

import RegisterPage from '../../pages/RegisterPage'
import withAuthFlow from '../../shared/withAuthFlow'

export default withAuthFlow(RegisterPage, 0, {
    name: '',
    password: '',
    confirmPassword: '',
    toc: false,
    invite: '',
})
