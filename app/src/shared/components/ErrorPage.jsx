// @flow

import React from 'react'
import NotFoundPage from '$shared/components/NotFoundPage'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import EditorError from '$shared/errors/EditorError'
import CanvasErrorPage from '$editor/canvas/components/CanvasErrorPage'

type Props = {
    error?: any,
}

const ErrorPage = ({ error, ...props }: Props) => {
    if (error instanceof ResourceNotFoundError) {
        return <NotFoundPage {...props} />
    }

    if (error instanceof EditorError) {
        return <CanvasErrorPage {...props} />
    }

    return <GenericErrorPage {...props} error={error} />
}

export default ErrorPage
