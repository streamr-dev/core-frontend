import React, { FunctionComponent } from 'react'
import NotFoundPage from '$shared/components/NotFoundPage'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'

const ErrorPage: FunctionComponent<{error: Error}> = ({ error, ...props }) => {
    if (error instanceof ResourceNotFoundError) {
        return <NotFoundPage {...props} />
    }

    return <GenericErrorPage {...props} />
}

export default ErrorPage
