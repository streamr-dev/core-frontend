import React, { useMemo } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import Layout from '$shared/components/Layout/Core'
import Toolbar from '$shared/components/Toolbar'
import { Provider as UndoContextProvider } from '$shared/contexts/Undo'
import routes from '$routes'

import StreamController, { useController } from '../StreamController'

import View from './View'
import Edit from './Edit'

const StreamPage = () => {
    const { stream, permissions, hasLoaded } = useController()

    const readOnly = useMemo(() => !permissions.includes('stream_edit'), [permissions])

    if (!hasLoaded || !stream) {
        return (
            <Layout
                loading
                nav={false}
                navComponent={(
                    <Toolbar
                        actions={{}}
                        altMobileLayout
                    />
                )}
            />
        )
    }

    if (readOnly) {
        return (
            <View />
        )
    }

    return (
        <Edit />
    )
}

export default () => {
    const { id: idProp } = useParams()
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])
    const { path } = useRouteMatch(routes.streams.public.show()) || {}

    return (
        <UndoContextProvider key={idProp}>
            <StreamController
                autoLoadStreamId={decodedIdProp}
                ignoreUnauthorized={path === routes.streams.public.show()}
            >
                <StreamPage />
            </StreamController>
        </UndoContextProvider>
    )
}
