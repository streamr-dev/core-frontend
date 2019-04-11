// @flow

import UsernamePasswordLogin from '../../components/UsernamePasswordLogin'
import withAuthFlow from '../WithAuthFlow'

export default withAuthFlow(UsernamePasswordLogin, 0, {
    email: '',
    password: '',
    rememberMe: false,
})
