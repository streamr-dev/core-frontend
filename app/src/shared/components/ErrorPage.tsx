import React from 'react'
import { useRouteError } from 'react-router-dom'
import NotFoundPage from '$shared/components/NotFoundPage'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'

export default function ErrorPage() {
    const error = useRouteError()

    if (error instanceof ResourceNotFoundError) {
        return <NotFoundPage />
    }

    return <GenericErrorPage />
}
