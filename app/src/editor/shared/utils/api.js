// @flow

import axios from 'axios'
import getAuthorizationHeader from '$shared/utils/getAuthorizationHeader'

export default () => (
    axios.create({
        headers: {
            ...getAuthorizationHeader(),
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    })
)
