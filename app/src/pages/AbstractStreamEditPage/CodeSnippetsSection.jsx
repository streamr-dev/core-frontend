import React, { useState, useCallback, useRef, useMemo, Fragment } from 'react'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import styled, { css } from 'styled-components'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'
import TOCPage from '$shared/components/TOCPage'
import useStreamId from '$shared/hooks/useStreamId'
import { lightNodeSnippets, websocketSnippets, httpSnippets, mqttSnippets } from '$utils/streamSnippets'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'

function getStreamSnippet(fn, id) {
    if (id) {
        return fn({
            id,
        }).javascript
    }

    return '// Create your stream above in order to get your code snippet.'
}

function UnstyledUnwrappedCodeSnippetsSection({ className, disabled }) {
    const streamId = useStreamId()

    const items = useMemo(() => [
        ['Light node (JS)', lightNodeSnippets],
        ['Websocket', websocketSnippets],
        ['HTTP', httpSnippets],
        ['MQTT', mqttSnippets],
    ].map(([label, fn]) => [
        'javascript',
        label,
        getStreamSnippet(fn, streamId),
    ]), [streamId])

    const { copy, isCopied } = useCopy()

    const [currentTab, setCurrentTab] = useState(0)

    const codeRef = useRef({})

    const onCopyClick = useCallback(() => {
        copy(codeRef.current[currentTab.toString()])
    }, [copy, currentTab])

    const [showAll, setShowAll] = useState(false)

    const onShowAllClick = useCallback(() => {
        setShowAll((c) => !c)
    }, [])

    return (
        <Fragment>
            <p>
                Bring your data to Streamr in the way that works best for you &mdash;
                as a JS library within your app, or via MQTT, HTTP or Websocket.
            </p>
            <Tabs
                className={className}
                footer={
                    <FooterWrap>
                        <ShowAllButton kind="secondary" onClick={onShowAllClick}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {!showAll ? (
                                    // eslint-disable-next-line max-len
                                    <path d="M15.879 11.794a.703.703 0 0 1 .915 1.062l-4.02 4.021-.093.083a1.093 1.093 0 0 1-1.455-.083l-4.02-4.02-.068-.08a.703.703 0 0 1 .068-.915l.079-.068a.703.703 0 0 1 .915.068l3.8 3.8 3.8-3.8zm.836-4.656l.08.068c.249.25.271.64.067.915l-.068.08-4.022 4.021a1.094 1.094 0 0 1-1.45.084l-.095-.085-4.021-4.02a.703.703 0 0 1 .915-1.063l.08.068L12 11.005l3.8-3.8a.704.704 0 0 1 .915-.067z" />
                                ) : (
                                    // eslint-disable-next-line max-len
                                    <path d="M8.121 12.404a.703.703 0 0 1-.99-.976l.075-.087 4.02-4.02.093-.083a1.093 1.093 0 0 1 1.362 0l.093.083 4.02 4.02.068.08c.182.244.184.58.007.827l-.075.088-.079.068a.704.704 0 0 1-.827.006l-.088-.074-3.8-3.8-3.8 3.8-.079.068zm-.836 4.656l-.08-.068a.703.703 0 0 1-.067-.916l.068-.079 4.022-4.021a1.094 1.094 0 0 1 1.45-.084l.095.085 4.021 4.02a.703.703 0 0 1-.915 1.063l-.08-.068-3.799-3.8-3.8 3.8a.703.703 0 0 1-.915.068z" />
                                )}
                            </svg>
                        </ShowAllButton>
                        <Button kind="secondary" onClick={onCopyClick} disabled={!!disabled}>
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </FooterWrap>
                }
                onSelect={setCurrentTab}
                selected={currentTab}
            >
                {items.map(([lang, label, snippet], index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Tabs.Item label={label} value={index} key={index}>
                        <ItemWrap $expand={showAll}>
                            {/*
                                toString() is needed because otherwise first item will not work because
                                of this check inside CodeSnippet: 'const idOrLanguage = id || language'
                            */}
                            <CodeSnippet id={index.toString()} language={lang} codeRef={codeRef}>
                                {snippet}
                            </CodeSnippet>
                        </ItemWrap>
                    </Tabs.Item>
                ))}
            </Tabs>
        </Fragment>
    )
}

const UnwrappedCodeSnippetsSection = styled(UnstyledUnwrappedCodeSnippetsSection)`
    margin-top: 2em;
`

const ShowAllButton = styled(Button)`
    && {
        border: 0;
        padding: 8px;
        width: 40px;
    }
`

const FooterWrap = styled.div`
    display: flex;
    justify-content: space-between;
    text-aling: left;
`

const ItemWrap = styled.div`
    ${({ $expand }) => !$expand && css`
        max-height: 265px;
        overflow: hidden;
    `}
`

export default function CodeSnippetsSection({ disabled, ...props }) {
    const isWithinNav = useIsWithinNav()

    return (
        <TOCPage.Section
            disabled={disabled}
            id="snippets"
            title="Code Snippets"
        >
            {!isWithinNav && (
                <UnwrappedCodeSnippetsSection
                    {...props}
                    disabled={disabled}
                />
            )}
        </TOCPage.Section>
    )
}
