// @flow

import axios from 'axios'
import qs from 'query-string'

import type { FormFields } from '../flowtype'

export default (url: string, form: FormFields, successWithError: boolean, xhr: boolean): Promise<*> => (
    axios
        .post(url, qs.stringify(form), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...(xhr ? {
                    'X-Requested-With': 'XMLHttpRequest',
                } : {}),
            },
        })
        .then(({ data }) => {
            if (successWithError && data.error) {
                throw new Error(data.error)
            }
        }, ({ response: { data } }) => {
            throw new Error(data.error || 'Something went wrong')
        })
)
