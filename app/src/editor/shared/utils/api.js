// @flow

import axios from 'axios'
import getAuthorizationHeader from '$shared/utils/getAuthorizationHeader'
import loginInterceptor from '$auth/utils/loginInterceptor'

export default () => (
    loginInterceptor(axios.create({
        headers: {
            ...getAuthorizationHeader(),
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    }))
)
