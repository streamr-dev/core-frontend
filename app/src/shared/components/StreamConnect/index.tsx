import React, { FunctionComponent, useMemo, useState } from 'react'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import styled from 'styled-components'
import copy from 'copy-to-clipboard'
import { COLORS, MEDIUM } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

type StreamConnectPropTypes = {
    streamId: string
}

export const StreamConnect: FunctionComponent<StreamConnectPropTypes> = ({streamId}) => {

    const lightNodeSnippet = useMemo<string>(() => {
        return `// Run a Streamr node right inside your JS app
const StreamrClient = require('streamr-client')
const streamr = new StreamrClient({
    auth: {
        privateKey: 'ethereum-private-key' 
    }
})

// Publish messages to a stream
streamr.publish('${streamId}', {
    hello: 'world',
})
            
// Or subscribe to a stream of messages
streamr.subscribe('${streamId}', (msg) => {
    // Handle incoming messages
})`
    }, [streamId])

    const websocketSnippet = useMemo<string>(() => {
        return `// You'll want to URI-encode the stream id
const streamId = encodeURIComponent('${streamId}')

// Connect to the Websocket plugin on your Streamr 
// node and send JSON messages to publish them
const pub = ws.connect(\`ws://my-streamr-node:7170/streams/\${streamId}/publish\`)
pub.send({
    hello: 'world',
})`
    }, [streamId])

    const httpSnippet = useMemo(() => {
        return `// Use your favourite language and HTTP library!

// You'll want to URI-encode the stream id
const streamId = encodeURIComponent('${streamId}')

// Publish messages to a stream by POSTing JSON 
// to the HTTP plugin on your Streamr node
http.post(\`http://my-streamr-node:7171/streams/\${streamId}\`, {
    hello: 'world'
})`
    }, [streamId])

    const mqttSnippet = useMemo(() => {
        return `// Use your favourite language and MQTT library!

// Connect to MQTT plugin on your Streamr node
mqtt.connect('mqtt://my-streamr-node')

// Publish a message to a stream
mqtt.publish('${streamId}', {
    hello: 'world',
})`
    }, [streamId])

    const [currentBrokerSnippet, setCurrentBrokerSnippet] = useState<string>(websocketSnippet)

    const handleTabChange = (tab: string): void => {
        switch (tab) {
            case 'websocket':
                setCurrentBrokerSnippet(websocketSnippet)
                break
            case 'http':
                setCurrentBrokerSnippet(httpSnippet)
                break
            case 'mqtt':
                setCurrentBrokerSnippet(mqttSnippet)
                break
        }
    }

    const handleCopy = (snippet: string): void => {
        copy(snippet)
        Notification.push({title: 'Copied!', icon: NotificationIcon.CHECKMARK})
    }

    return <div>
        <StreamConnectHeader>Connect</StreamConnectHeader>
        <StreamConnectText>
            Applications publish and subscribe to streams via Streamr nodes.
            In other words, nodes are the access points to the Streamr Network.
            To connect your application to streams, you interface it with a Streams node.
        </StreamConnectText>
        <StreamConnectSubHeader>
            There are two strategies for interfacing applications with Streamr nodes:
        </StreamConnectSubHeader>
        <StreamConnectList>
            <li>
                <strong>Light node: </strong>
                the node is imported to your application as a library and runs locally as part of your application
            </li>
            <li>
                <strong>Broker node: </strong>
                the node runs separately, and your application connects to it remotely using one of the supported protocols
            </li>
        </StreamConnectList>
        <StreamConnectLink href={'/'}>
            <span>Pattern of data integration</span>
            <SvgIcon name={'linkOut'} />
        </StreamConnectLink>
        <StreamConnectLink href={'/'}>
            <span>Streamr CLI</span>
            <SvgIcon name={'linkOut'} />
        </StreamConnectLink>
        <StreamConnectLink href={'/'}>
            <span>Streamr Client quickstart guide</span>
            <SvgIcon name={'linkOut'} />
        </StreamConnectLink>

        <StreamConnectHeader className="with-top-margin">
            Connect using a Light node (JS Streamr Client)
        </StreamConnectHeader>

        <StreamConnectLightNodeSnippetContainer>
            <CodeSnippet language={'javascript'}>{lightNodeSnippet}</CodeSnippet>
        </StreamConnectLightNodeSnippetContainer>
        <StreamConnectSnippetCopyContainer>
            <Button kind={'secondary'} onClick={() => handleCopy(lightNodeSnippet)}>Copy</Button>
        </StreamConnectSnippetCopyContainer>

        <StreamConnectHeader className="with-top-margin">
            Connect using a Broker node
        </StreamConnectHeader>

        <Tabs selected={'websocket'} onSelect={handleTabChange}>
            <Tabs.Item label={'Websocket'} value={'websocket'} key={0}>
                <CodeSnippet language={'javascript'}>{websocketSnippet}</CodeSnippet>
            </Tabs.Item>
            <Tabs.Item label={'HTTP'} value={'http'} key={1}>
                <CodeSnippet language={'javascript'}>{httpSnippet}</CodeSnippet>
            </Tabs.Item>
            <Tabs.Item label={'MQTT'} value={'mqtt'} key={2}>
                <CodeSnippet language={'javascript'}>{mqttSnippet}</CodeSnippet>
            </Tabs.Item>
        </Tabs>
        <StreamConnectSnippetCopyContainer>
            <Button kind={'secondary'} onClick={() => handleCopy(currentBrokerSnippet)}>Copy</Button>
        </StreamConnectSnippetCopyContainer>
    </div>
}

const StreamConnectHeader = styled.p`
  font-size: 24px;
  color: ${COLORS.primary};
  line-height: 64px;
  margin-bottom: 24px;
  &.with-top-margin {
    margin-top: 40px;
  }
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
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.docLink};
  padding: 19px 24px;
  margin-bottom: 8px;
  span {
    color: ${COLORS.primary}
  }
  svg {
    color: ${COLORS.primary};
  }
`
