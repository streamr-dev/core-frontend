import React, { FunctionComponent, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import Button from '~/shared/components/Button'
import SelectField2 from '~/marketplace/components/SelectField2'
import { StreamId } from '~/shared/types/stream-types'
import { truncateStreamName } from '~/shared/utils/text'
import useCopy from '~/shared/hooks/useCopy'

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
    lightNodeHeader() {
        return `
            // Run a Streamr node right inside your JS app
            const StreamrClient = require('streamr-client')
            const streamr = new StreamrClient({
                auth: {
                    privateKey: 'ethereum-private-key' 
                }
            })
        `
    },
    lightNodeSubscribe(streamId: string) {
        return `
            ${this.lightNodeHeader()}
            // Subscribe to a stream of messages
            streamr.subscribe('${streamId}', (msg) => {
                // Handle incoming messages
            })
        `
    },
    lightNodePublish(streamId: string) {
        return `
            ${this.lightNodeHeader()}
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
            const sub = ws.connect(\`ws://my-streamr-node:7170/streams/${streamId}/subscribe\`)
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

    const lightNodeSnippet = stripIndent(
        action === 'publish'
            ? Snippet.lightNodePublish(streamId)
            : Snippet.lightNodeSubscribe(streamId),
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
        <div className={'row'}>
            <div className={'col-lg-7'}>
                <StreamConnectHeader>Connect</StreamConnectHeader>
                <StreamConnectText>
                    Applications publish and subscribe to streams via Streamr nodes. In
                    other words, nodes are the access points to the Streamr Network. To
                    connect your application to streams, you interface it with a Streamr
                    node.
                </StreamConnectText>
                <StreamConnectSubHeader>
                    There are two strategies for interfacing applications with Streamr
                    nodes:
                </StreamConnectSubHeader>
                <StreamConnectList>
                    <li>
                        <strong>Light node: </strong>
                        the node is imported to your application as a library and runs
                        locally as part of your application
                    </li>
                    <li>
                        <strong>Broker node: </strong>
                        the node runs separately, and your application connects to it
                        remotely using one of the supported protocols
                    </li>
                </StreamConnectList>

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
                            onChange={(action: 'subscribe' | 'publish') => {
                                setAction(action)
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
                                { label: 'Light node', value: 'lightNode' },
                                { label: 'Broker node', value: 'brokerNode' },
                            ]}
                            value={nodeType}
                            isClearable={false}
                            onChange={(nodeType: 'lightNode' | 'brokerNode') => {
                                setNodeType(nodeType)
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
                                onClick={() =>
                                    void copy(lightNodeSnippet, {
                                        toastMessage: 'Copied',
                                    })
                                }
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
                                onClick={() =>
                                    void copy(currentBrokerSnippet, {
                                        toastMessage: 'Copied',
                                    })
                                }
                            >
                                Copy
                            </Button>
                        </StreamConnectSnippetCopyContainer>
                    </BrokerNodeSnippetContainer>
                )}
            </div>
            <RightColumn className={'col-lg-4 offset-lg-1'}>
                {/*
                <StreamConnectLink href={'/'}>
                    <span>Pattern of data integration</span>
                    <SvgIcon name={'linkOut'} />
                </StreamConnectLink>
            */}
                <StreamConnectLink
                    href={'https://www.npmjs.com/package/@streamr/cli-tools'}
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                >
                    <span>Streamr command line tool</span>
                    <SvgIcon name={'linkOut'} />
                </StreamConnectLink>
                <StreamConnectLink
                    href={'https://www.npmjs.com/package/streamr-client'}
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                >
                    <span>Streamr JavaScript Client quickstart</span>
                    <SvgIcon name={'linkOut'} />
                </StreamConnectLink>
            </RightColumn>
        </div>
    )
}

const RightColumn = styled.div`
    padding-top: 88px;
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

const StreamConnectSubHeader = styled.p`
    font-size: 20px;
    color: ${COLORS.primary};
    font-weight: ${MEDIUM};
    margin-bottom: 24px;
`

const StreamConnectLightNodeSnippetContainer = styled.div`
    border: 1px solid ${COLORS.separator};
    background-color: white;
    margin-top: 30px;
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

const StreamConnectList = styled.ul`
    padding: 0;
    list-style-position: inside;
    margin-bottom: 36px;
    li {
        font-size: 16px;
    }
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
    height: 40px;
    display: flex;
    flex-wrap: nowrap;
    margin-top: 20px;
    align-items: center;

    > * {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
`

const BrokerNodeSnippetContainer = styled.div`
    margin-top: 30px;
`

const SelectContainer = styled.div`
    height: 100%;
    min-width: 140px;
`