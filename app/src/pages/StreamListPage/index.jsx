import React, { Fragment, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { StreamPermission } from 'streamr-client'
import CreateStreamButton from '$app/src/pages/StreamListPage/CreateStreamButton'
import Layout from '$userpages/components/Layout'
import Search from '$userpages/components/Header/Search'
import { CoreHelmet } from '$shared/components/Helmet'
import ListContainer from '$app/src/pages/StreamListPage/ListContainer'
import Entry from '$app/src/pages/StreamListPage/Entry'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import Zero from '$app/src/pages/StreamListPage/Zero'
import SnippetDialog from '$app/src/pages/StreamListPage/SnippetDialog'
import MigrationNote from '$app/src/pages/StreamListPage/MigrationNote'
import { StreamList } from '$shared/components/List'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import useStreams from '$shared/hooks/useStreams'
import StreamContext from '$shared/contexts/StreamContext'
import StreamPermissionsProvider from '$shared/components/StreamPermissionsProvider'
import SidebarProvider, { useSidebar } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import useCopy from '$shared/hooks/useCopy'
import useModal from '$shared/hooks/useModal'
import useRemoveStream from '$shared/hooks/useRemoveStream'
import Sidebar from '$shared/components/Sidebar'
import routes from '$routes'

function StreamListPage() {
    const [search, setSearch] = useState('')

    const streams = useStreams(search)

    const fetching = streams == null

    const sidebar = useSidebar()

    const removeStream = useRemoveStream()

    const [shareSidebarStreamId, setShareSidebarStreamId] = useState()

    const openShareDialog = useCallback((id) => {
        setShareSidebarStreamId(id)
        sidebar.open('share')
    }, [sidebar])

    const closeShareSidebar = useCallback(() => {
        setShareSidebarStreamId(undefined)
        sidebar.close()
    }, [sidebar])

    const { api: snippetDialog } = useModal('userpages.streamSnippet')

    const openSnippetsDialog = useCallback((streamId) => {
        snippetDialog.open({
            streamId,
        })
    }, [snippetDialog])

    const history = useHistory()

    const visitStream = useCallback((id) => {
        history.push(routes.streams.show({
            id,
        }))
    }, [history])

    const { copy } = useCopy(() => {
        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    })

    const onStreamRefresh = useCallback(() => {
        Notification.push({
            title: 'Stream refreshed',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [])

    return (
        <Layout
            headerAdditionalComponent={<CreateStreamButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder="Filter streams"
                    value={search}
                    onChange={setSearch}
                />
            }
            loading={fetching}
        >
            <CoreHelmet title="Streams" />
            <ListContainer>
                {!fetching && streams && streams.length <= 0 && (
                    <Zero
                        filter={search}
                        onResetFilterClick={() => void setSearch('')}
                    />
                )}
                {streams && streams.length > 0 && (
                    <Fragment>
                        <StreamList>
                            <StreamList.Header>
                                <StreamList.HeaderItem>
                                    Name
                                </StreamList.HeaderItem>
                                <StreamList.HeaderItem>
                                    Description
                                </StreamList.HeaderItem>
                                <StreamList.HeaderItem>
                                    Updated
                                </StreamList.HeaderItem>
                                <StreamList.HeaderItem>
                                    Last Data
                                </StreamList.HeaderItem>
                                <StreamList.HeaderItem center>
                                    Status
                                </StreamList.HeaderItem>
                            </StreamList.Header>
                            {streams.map((stream) => (
                                <StreamIdContext.Provider key={stream.id} value={stream.id}>
                                    <StreamPermissionsProvider
                                        operations={[
                                            StreamPermission.DELETE,
                                            StreamPermission.EDIT,
                                            StreamPermission.GRANT,
                                            StreamPermission.SUBSCRIBE,
                                        ]}
                                    >
                                        <StreamContext.Provider value={stream}>
                                            <Entry
                                                onClick={visitStream}
                                                onCopyId={copy}
                                                onRefresh={onStreamRefresh}
                                                onRemoveClick={removeStream}
                                                onShareClick={openShareDialog}
                                                onSnippetsClick={openSnippetsDialog}
                                            />
                                        </StreamContext.Provider>
                                    </StreamPermissionsProvider>
                                </StreamIdContext.Provider>
                            ))}
                        </StreamList>
                        <MigrationNote />
                    </Fragment>
                )}
            </ListContainer>
            <SnippetDialog />
            {/* @todo <SwitchNetworkModal /> */}
            <Sidebar.WithErrorBoundary
                isOpen={sidebar.isOpen()}
                onClose={closeShareSidebar}
            >
                {sidebar.isOpen('share') && (
                    <ShareSidebar
                        sidebarName="share"
                        resourceTitle={shareSidebarStreamId}
                        resourceType="STREAM"
                        resourceId={shareSidebarStreamId}
                        onClose={closeShareSidebar}
                    />
                )}
            </Sidebar.WithErrorBoundary>
            <DocsShortcuts />
        </Layout>
    )
}

export default function StreamListPageWrapper() {
    return (
        <SidebarProvider>
            <StreamListPage />
        </SidebarProvider>
    )
}