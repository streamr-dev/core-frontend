import React from 'react'
import { StreamPermission } from 'streamr-client'
import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import { StreamPreview } from '$shared/components/StreamPreview'
import { StreamConnect } from '$shared/components/StreamConnect'
import { useCurrentAbility } from '$shared/stores/abilities'
import { StreamDraftContext, useInitStreamDraft, useIsCurrentDraftBusy } from '$shared/stores/streamEditor'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import routes from '$routes'
import StreamPage from './StreamPage'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import DeleteSection from './AbstractStreamEditPage/DeleteSection'
import PersistanceAlert from './AbstractStreamEditPage/PersistanceAlert'

function CreatePage() {
    const disabled = useIsCurrentDraftBusy()

    return (
        <StreamPage showSaveButton={false} fullWidth={false}>
            <InfoSection disabled={disabled} />
            <AccessControlSection disabled={disabled} />
            <HistorySection disabled={disabled} />
            <PartitionsSection disabled={disabled} />
        </StreamPage>
    )
}

function EditPage() {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const canDelete = useCurrentAbility(StreamPermission.DELETE)

    const disabled = useIsCurrentDraftBusy()

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage loading={loading}>
            <PersistanceAlert />
            <InfoSection disabled={disabled} />
            <AccessControlSection disabled={disabled} />
            <HistorySection disabled={disabled} />
            <PartitionsSection disabled={disabled} />
            {canDelete && <DeleteSection />}
        </StreamPage>
    )
}

function LiveDataPage() {
    const canSubscribe = useCurrentAbility(StreamPermission.SUBSCRIBE)

    const loading = typeof canSubscribe === 'undefined'

    const streamId = useDecodedStreamId()

    return (
        <StreamPage loading={loading} includeContainerBox={false} showSaveButton={false}>
            <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
        </StreamPage>
    )
}

function ConnectPage() {
    const streamId = useDecodedStreamId()

    const loading = useCurrentAbility(StreamPermission.EDIT) == null

    return (
        <StreamPage loading={loading} showSaveButton={false} fullWidth>
            <StreamConnect streams={[streamId]} />
        </StreamPage>
    )
}

function StreamRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Redirect to={routes.streams.overview({ id })} />
}

export default function StreamEditPage() {
    const streamId = useDecodedStreamId()

    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(streamId === 'new' ? undefined : streamId)}>
            <Switch>
                <Route exact path={routes.streams.new()} component={CreatePage} key="CreatePage" />
                <Route exact path={routes.streams.show()} component={StreamRedirect} key="Redirection" />
                <Route exact path={routes.streams.overview()} component={EditPage} key="EditPage" />
                <Route exact path={routes.streams.connect()} component={ConnectPage} key="ConnectPage" />
                <Route exact path={routes.streams.liveData()} component={LiveDataPage} key="LiveDataPage" />
            </Switch>
        </StreamDraftContext.Provider>
    )
}
