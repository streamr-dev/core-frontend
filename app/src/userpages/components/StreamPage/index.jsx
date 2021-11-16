import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch, useParams } from 'react-router-dom'

import { selectUserData } from '$shared/modules/user/selectors'
import Layout from '$shared/components/Layout/Core'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'

import View from './View'
import Edit from './Edit'
import useStream from './useStream'

const StreamPage = () => {
    const { id: idProp } = useParams()
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])
    const { path } = useRouteMatch(routes.streams.public.show()) || {}

    const { stream, permissions, fetching, fetch } = useStream()
    const updating = false

    const [readOnly, canShare] = useMemo(() => {
        if (!permissions) {
            return [false, false]
        }

        const operations = new Set(permissions.map(({ operation }) => operation))

        return [
            !operations.has('stream_edit'),
            operations.has('stream_share'),
        ]
    }, [permissions])

    const currentUser = useSelector(selectUserData)

    useEffect(() => {
        fetch({
            streamId: decodedIdProp,
            isPublic: (path === routes.streams.public.show()),
        })
    }, [fetch, decodedIdProp, path])

    if (!permissions || (fetching && !updating) || !stream) {
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
            disabled={updating}
        />
    )
}

export default StreamPage
