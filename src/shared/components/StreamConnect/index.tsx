import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import { StreamPermission } from '@streamr/sdk'
import { COLORS, DESKTOP, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { Button } from '~/components/Button'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import { StreamId } from '~/shared/types/stream-types'
import { truncateStreamName } from '~/shared/utils/text'
import useCopy from '~/shared/hooks/useCopy'
import { useStreamAbility } from '~/shared/stores/streamAbilities'
import { address0 } from '~/consts'
import { route } from '~/routes'

function stripIndent(code: string): string {
    let minIndent = Number.POSITIVE_INFINITY

    ;(code.match(/^[ \t]*(?=\S)/gm) || ['']).forEach(({ length }) => {
        if (length < minIndent) {
            minIndent = length
        }
    })

    return code
        .replace(new RegExp(`^[ \\t]{${minIndent}}`, 'gm'), '')
        .trim()
        .replace(/^\s+$/gm, '')
}

const Snippet = {
    createClient(hasPermission: boolean) {
        if (hasPermission) {
            return `const streamr = new StreamrClient()`
        }

        return `const streamr = new StreamrClient({
                auth: {
                    privateKey: 'ethereum-private-key' 
                }
            })`
    },
    lightNodeHeader(hasPermission: boolean) {
        return `
            // Run a Streamr node right inside your JS app
            const StreamrClient = require('@streamr/sdk')
            ${this.createClient(hasPermission)}
        `
    },
    lightNodeSubscribe(streamId: string, hasPermission: boolean) {
        return `
            ${this.lightNodeHeader(hasPermission)}
            // Subscribe to a stream of messages
            streamr.subscribe('${streamId}', (msg) => {
                // Handle incoming messages
            })
        `
    },
    lightNodePublish(streamId: string, hasPermission: boolean) {
        return `
            ${this.lightNodeHeader(hasPermission)}
            // Publish messages to a stream
            streamr.publish('${streamId}', {
                hello: 'world',
            })
        `
    },
    websocketHeader(streamId: string) {
        return `
            // You'll want to URI-encode the stream id
            const streamId = encodeURIComponent('${streamId}')
        `
    },
    websocketPublish(streamId: string) {
        return `
            ${this.websocketHeader(streamId)}
            // Connect to the Websocket plugin on your Streamr 
            // node and send JSON messages to publish them
            const pub = ws.connect(\`ws://my-streamr-node:7170/streams/\${streamId}/publish\`)
            pub.send({
                hello: 'world',
            })
        `
    },
    websocketSubscribe(streamId: string) {
        return `
            ${this.websocketHeader(streamId)}
            // Connect to the Websocket plugin on your Streamr 
            // node and subscribe to a stream of messages
            const sub = ws.connect(\`ws://my-streamr-node:7170/streams/\${streamId}/subscribe\`)
            sub.onmessage = (msg) => {
                // Handle incoming messages
            }
        `
    },
    httpSubscribe() {
        return `
            // The Subscribe over HTTP is not available, as in it's not a valid selection.
        `
    },
    httpPublish(streamId: string) {
        return `
            // Use your favourite language and HTTP library!

            // You'll want to URI-encode the stream id
            const streamId = encodeURIComponent('${streamId}')

            // Publish messages to a stream by POSTing JSON 
            // to the HTTP plugin on your Streamr node
            http.post(\`http://my-streamr-node:7171/streams/\${streamId}\`, {
                hello: 'world'
            })
        `
    },
    mqttHeader() {
        return `
            // Use your favourite language and MQTT library!

            // Connect to MQTT plugin on your Streamr node
            mqtt.connect('mqtt://my-streamr-node')
        `
    },
    mqttSubscribe(streamId: string) {
        return `
            ${this.mqttHeader()}
            // Subscribe to a stream of messages
            mqtt.subscribe('${streamId}', (msg) => {
                // Handle incoming messages
            })
        `
    },
    mqttPublish(streamId: string) {
        return `
            ${this.mqttHeader()}
            // Publish a message to a stream
            mqtt.publish('${streamId}', {
                hello: 'world',
            })
        `
    },
}

export const StreamConnect: FunctionComponent<{ streams: StreamId[] }> = ({
    streams,
}) => {
    const [streamId, setSelectedStream] = useState<StreamId>(streams[0])
    const [action, setAction] = useState<'subscribe' | 'publish'>('subscribe')
    const [nodeType, setNodeType] = useState<'lightNode' | 'brokerNode'>('lightNode')
    const [currentProtocol, setCurrentProtocol] = useState<'websocket' | 'http' | 'mqtt'>(
        'websocket',
    )

    const hasPublicPubPermission = useStreamAbility(
        streamId,
        address0,
        StreamPermission.PUBLISH,
    )
    const hasPublicSubPermission = useStreamAbility(
        streamId,
        address0,
        StreamPermission.SUBSCRIBE,
    )

    const lightNodeSnippet = stripIndent(
        action === 'publish'
            ? Snippet.lightNodePublish(streamId, !!hasPublicPubPermission)
            : Snippet.lightNodeSubscribe(streamId, !!hasPublicSubPermission),
    )

    const websocketSnippet = stripIndent(
        action === 'publish'
            ? Snippet.websocketPublish(streamId)
            : Snippet.websocketSubscribe(streamId),
    )

    const httpSnippet = stripIndent(
        action === 'subscribe' ? Snippet.httpSubscribe() : Snippet.httpPublish(streamId),
    )

    const mqttSnippet = stripIndent(
        action === 'publish'
            ? Snippet.mqttPublish(streamId)
            : Snippet.mqttSubscribe(streamId),
    )

    const { copy } = useCopy()

    const currentBrokerSnippet = (() => {
        switch (currentProtocol) {
            case 'websocket':
                return websocketSnippet
            case 'http':
                return httpSnippet
            case 'mqtt':
                return mqttSnippet
        }
    })()

    return (
        <Grid>
            <div>
                <StreamConnectHeader>Connect</StreamConnectHeader>
                <StreamConnectText>
                    Here are the code snippets to connect to this stream with the Streamr
                    SDK or through a separately running Streamr node:
                </StreamConnectText>
                <SnippetSelectorContainer>
                    <SelectContainer>
                        <SelectField2
                            placeholder={''}
                            options={[
                                { label: 'Subscribe', value: 'subscribe' },
                                { label: 'Publish', value: 'publish' },
                            ]}
                            value={action}
                            isClearable={false}
                            onChange={(action: string) => {
                                if (action === 'subscribe' || action === 'publish') {
                                    setAction(action)
                                }
                            }}
                            noShrink={true}
                            fullWidth
                        />
                    </SelectContainer>
                    <span>to</span>
                    <SelectContainer>
                        <SelectField2
                            placeholder={''}
                            options={streams.map((streamId) => ({
                                value: streamId,
                                label: truncateStreamName(streamId),
                            }))}
                            value={streamId}
                            isClearable={false}
                            onChange={(streamId) => {
                                setSelectedStream(streamId)
                            }}
                            fullWidth
                        />
                    </SelectContainer>
                    <span>using</span>
                    <SelectContainer>
                        <SelectField2
                            placeholder={''}
                            options={[
                                { label: 'Streamr SDK', value: 'lightNode' },
                                { label: 'Streamr node', value: 'brokerNode' },
                            ]}
                            value={nodeType}
                            isClearable={false}
                            onChange={(nodeType: string) => {
                                if (
                                    nodeType === 'lightNode' ||
                                    nodeType === 'brokerNode'
                                ) {
                                    setNodeType(nodeType)
                                }
                            }}
                            noShrink={true}
                            fullWidth
                        />
                    </SelectContainer>
                </SnippetSelectorContainer>

                {nodeType === 'lightNode' && (
                    <>
                        <StreamConnectLightNodeSnippetContainer>
                            <CodeSnippet language={'javascript'}>
                                {lightNodeSnippet}
                            </CodeSnippet>
                        </StreamConnectLightNodeSnippetContainer>
                        <StreamConnectSnippetCopyContainer>
                            <Button
                                kind="secondary"
                                onClick={() => void copy(lightNodeSnippet)}
                            >
                                Copy
                            </Button>
                        </StreamConnectSnippetCopyContainer>
                    </>
                )}

                {nodeType === 'brokerNode' && (
                    <BrokerNodeSnippetContainer>
                        <Tabs
                            selected={currentProtocol}
                            onSelect={(tab) => setCurrentProtocol(tab)}
                        >
                            <Tabs.Item label={'Websocket'} value={'websocket'} key={0}>
                                <CodeSnippet language={'javascript'}>
                                    {websocketSnippet}
                                </CodeSnippet>
                            </Tabs.Item>
                            <Tabs.Item label={'HTTP'} value={'http'} key={1}>
                                <CodeSnippet language={'javascript'}>
                                    {httpSnippet}
                                </CodeSnippet>
                            </Tabs.Item>
                            <Tabs.Item label={'MQTT'} value={'mqtt'} key={2}>
                                <CodeSnippet language={'javascript'}>
                                    {mqttSnippet}
                                </CodeSnippet>
                            </Tabs.Item>
                        </Tabs>
                        <StreamConnectSnippetCopyContainer>
                            <Button
                                kind="secondary"
                                onClick={() => void copy(currentBrokerSnippet)}
                            >
                                Copy
                            </Button>
                        </StreamConnectSnippetCopyContainer>
                    </BrokerNodeSnippetContainer>
                )}
            </div>
            <RightColumn>
                <StreamConnectLink
                    href={route('docs', '/guides/nodejs')}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <span>Pub/Sub in NodeJS</span>
                    <SvgIcon name="linkOut" />
                </StreamConnectLink>
                <StreamConnectLink
                    href={route('docs', '/guides/web-app-frameworks')}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <span>Use Streamr in your web app</span>
                    <SvgIcon name="linkOut" />
                </StreamConnectLink>
                <StreamConnectLink
                    href={route('docs', '/usage/cli-tool')}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <span>The Streamr CLI tool</span>
                    <SvgIcon name="linkOut" />
                </StreamConnectLink>
                <StreamConnectLink
                    href={route(
                        'docs',
                        '/usage/connect-apps-and-iot/streamr-node-interface',
                    )}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <span>Interfacing with a Streamr node</span>
                    <SvgIcon name="linkOut" />
                </StreamConnectLink>
            </RightColumn>
        </Grid>
    )
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: initial;
    grid-auto-flow: row;
    gap: 32px;

    @media ${DESKTOP} {
        grid-template-columns: 65% auto;
        grid-auto-flow: column;
        gap: 88px;
    }
`

const RightColumn = styled.div`
    padding-top: 0px;

    @media ${DESKTOP} {
        padding-top: 88px;
    }
`

const StreamConnectHeader = styled.p`
    font-size: 24px;
    color: ${COLORS.primary};
    line-height: 64px;
    margin-bottom: 24px;
`

const StreamConnectText = styled.p`
    font-size: 16px;
    color: ${COLORS.primary};
`

const StreamConnectLightNodeSnippetContainer = styled.div`
    border: 1px solid ${COLORS.separator};
    background-color: white;
    margin-top: 30px;
    max-width: calc(100vw - 100px);
    @media ${TABLET} {
        max-width: calc(100vw - 160px);
    }
`
const StreamConnectSnippetCopyContainer = styled.div`
    border: 1px solid ${COLORS.separator};
    border-top: none;
    background-color: white;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const StreamConnectLink = styled.a`
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${COLORS.secondaryLight};
    padding: 10px 16px;
    margin-bottom: 8px;
    border-radius: 4px;
    span {
        color: ${COLORS.primary};
    }
    svg {
        color: ${COLORS.primary};
    }
`

const SnippetSelectorContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    margin-top: 20px;
    align-items: left;
    flex-direction: column;

    @media ${TABLET} {
        flex-direction: row;
        align-items: center;

        > * {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
`

const BrokerNodeSnippetContainer = styled.div`
    margin-top: 30px;
    max-width: calc(100vw - 100px);
    @media ${TABLET} {
        max-width: calc(100vw - 160px);
    }
`

const SelectContainer = styled.div`
    height: 100%;
    min-width: 140px;
`
