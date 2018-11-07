// @flow

import axios from 'axios'
import qs from 'query-string'

import type { FormFields } from '$shared/flowtype/auth-types'

export default (url: string, form: FormFields, successWithError: boolean): Promise<*> => (
    axios
        .post(url, qs.stringify(form), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(({ data }) => {
            if (successWithError && data.error) {
                throw new Error(data.error)
            }
        }, (error) => {
            const message = (() => {
                try {
                    return error.response.data.error
                } catch (e) {
                    return ''
                }
            })()
            throw new Error(message || 'Something went wrong')
        })
)
