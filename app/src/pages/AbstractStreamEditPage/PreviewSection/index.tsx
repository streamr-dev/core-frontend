import React, { Fragment, useReducer, useState } from 'react'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import { Link } from 'react-router-dom'
import useStreamId from '$shared/hooks/useStreamId'
import Button from '$shared/components/Button'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useIsAuthenticated } from '$app/src/auth/hooks/useIsAuthenticated'
import useStreamData from '$shared/hooks/useStreamData'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import routes from '$routes'
import PreviewTable from './PreviewTable'

function DefaultDescription() {
    return (
        <Description>
            Live data in this stream is displayed below. For a more detailed view, you can open the Inspector. If you
            need help pushing data to your stream, see the <a href="https://docs.streamr.network/">docs</a>.
        </Description>
    )
}

function UnwrappedPreviewSection() {
    const streamId = useStreamId()
    const [isRunning, toggleIsRunning] = useReducer((current) => !current, true)
    const [dataError, setDataError] = useState(false)
    const hasLoaded = useIsAuthenticated()
    const client = useClient()
    const isMounted = useIsMounted()
    const streamData = useStreamData(streamId, {
        activeFn: () => streamId && isRunning,
        onError: () => {
            if (isMounted()) {
                setDataError(true)
            }
        },
        tail: 10,
    })
    return (
        <Fragment>
            <PreviewTable streamData={streamData} />
            <Controls>
                <ErrorNotice>
                    {hasLoaded && !client && <p>Error: Unable to process the stream data.</p>}
                    {dataError && <p>Error: Some messages in the stream have invalid content and are not shown.</p>}
                </ErrorNotice>
                <Button kind="secondary" onClick={toggleIsRunning} disabled={streamData.length === 0} type="button">
                    {!isRunning ? 'Start' : 'Stop'}
                </Button>
                {streamId ? (
                    <Button
                        tag={Link}
                        kind="secondary"
                        to={routes.streams.liveData({
                            id: streamId,
                        })}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Inspect data
                    </Button>
                ) : (
                    <Button kind="secondary" type="button" disabled>
                        Inspect data
                    </Button>
                )}
            </Controls>
        </Fragment>
    )
}

const Controls = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;

    > * + * {
        margin-left: 1rem;
    }
`
const ErrorNotice = styled.div`
    flex: 1;
    font-size: 12px;
    color: #808080;

    p {
        margin: 0;
        line-height: 1.5rem;
    }
`
const Description = styled.p`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

function UnstyledPreviewSection({ className, disabled, desc = <DefaultDescription /> }) {
    const isWithinNav = useIsWithinNav()
    return (
        <TOCSection id="preview" title="Preview" disabled={disabled}>
            {desc}
            <div className={className}>{!isWithinNav && <UnwrappedPreviewSection />}</div>
        </TOCSection>
    )
}

const PreviewSection = styled(UnstyledPreviewSection)`
    background-color: #fdfdfd;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`
export default PreviewSection
