// @flow

import React from 'react'
import NotFoundPage from '$shared/components/NotFoundPage'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'

type Props = {
    error?: any,
}

const ErrorPage = ({ error, ...props }: Props) => {
    if (error instanceof ResourceNotFoundError) {
        return <NotFoundPage {...props} />
    }
    return <GenericErrorPage {...props} error={error} />
}

export default ErrorPage
