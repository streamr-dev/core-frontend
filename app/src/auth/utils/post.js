// @flow

import { post } from '$shared/utils/api'

import type { FormFields } from '$shared/flowtype/auth-types'

export default (url: string, form: FormFields, successWithError: boolean): Promise<*> => post({
    url,
    data: form,
})
    .then((data) => {
        if (successWithError && data.error) {
            throw new Error(data.error)
        }
        return data
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

