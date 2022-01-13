import React, { useMemo } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'
import { StreamPermission } from 'streamr-client'

import Layout from '$shared/components/Layout/Core'
import Toolbar from '$shared/components/Toolbar'
import { Provider as UndoContextProvider } from '$shared/contexts/Undo'
import { networks } from '$shared/utils/constants'
import useRequireNetwork from '$shared/hooks/useRequireNetwork'

import routes from '$routes'

import StreamController, { useController } from '../StreamController'
import SwitchNetworkModal from './SwitchNetworkModal'

import View from './View'
import Edit from './Edit'

const StreamPage = () => {
    const { stream, permissions, hasLoaded } = useController()
    const { isPending, isCorrect, validateNetwork } = useRequireNetwork(networks.SIDECHAIN)

    const readOnly = useMemo(() => isPending || !isCorrect || !permissions[StreamPermission.EDIT], [permissions, isPending, isCorrect])

    if (!hasLoaded || !stream) {
        return (
            <Layout
                nav={false}
                navComponent={(
                    <Toolbar
                        loading
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
        <Edit
            validateNetwork={validateNetwork}
        />
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
                <SwitchNetworkModal />
            </StreamController>
        </UndoContextProvider>
    )
}
