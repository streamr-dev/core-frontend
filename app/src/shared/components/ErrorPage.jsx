import React from 'react'
import NotFoundPage from '$shared/components/NotFoundPage'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import OperationNotPermittedError from '$shared/errors/OperationNotPermittedError'

const NOT_FOUND_ERRORS = [
    OperationNotPermittedError,
    ResourceNotFoundError,
]

const ErrorPage = ({ error, ...props }) => {
    if (NOT_FOUND_ERRORS.find((Err) => error instanceof Err)) {
        return <NotFoundPage {...props} />
    }
    return <GenericErrorPage {...props} error={error} />
}

export default ErrorPage
