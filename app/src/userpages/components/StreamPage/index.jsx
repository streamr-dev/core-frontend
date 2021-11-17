import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch, useParams } from 'react-router-dom'

import { selectUserData } from '$shared/modules/user/selectors'
import Layout from '$shared/components/Layout/Core'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'

import StreamController, { useController } from '../StreamController'

import View from './View'
import Edit from './Edit'

const StreamPage = () => {
    const { stream, permissions, hasLoaded } = useController()

    const [readOnly, canShare] = useMemo(() => {
        if (!permissions) {
            return [false, false]
        }

        return [
            !permissions.includes('stream_edit'),
            permissions.includes('stream_share'),
        ]
    }, [permissions])

    const currentUser = useSelector(selectUserData)

    if (!hasLoaded || !stream || !permissions) {
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
            <View
                stream={stream}
                currentUser={currentUser}
            />
        )
    }

    return (
        <Edit
            stream={stream}
            canShare={canShare}
        />
    )
}

export default () => {
    const { id: idProp } = useParams()
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])
    const { path } = useRouteMatch(routes.streams.public.show()) || {}

    return (
        <StreamController
            key={idProp}
            autoLoadStreamId={decodedIdProp}
            ignoreUnauthorized={path === routes.streams.public.show()}
        >
            <StreamPage />
        </StreamController>
    )
}
