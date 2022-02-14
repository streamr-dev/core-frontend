import React, { useState, useCallback, useRef } from 'react'
import { CodeSnippet, Tabs } from '@streamr/streamr-layout'
import { css } from 'styled-components'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'
import { MEDIUM } from '$shared/utils/styled'

const CodeSnippets = ({ items, title, disabled, ...props }) => {
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
        <div
            {...props}
            css={`
                margin-top: 2em;

                & + & {
                    margin-top: 3em;
                }
            `}
        >
            <h4
                css={`
                    font-size: 18px;
                    font-weight: ${MEDIUM};
                    line-height: 1;
                    margin: 0 0 1em;
                    padding: 0;
                `}
            >
                {title}
            </h4>
            <Tabs
                footer={
                    <div
                        // eslint-disable-next-line react/jsx-curly-brace-presence
                        css={`
                            display: flex;
                            justify-content: space-between;
                            text-aling: left;
                        `}
                    >
                        <Button
                            kind="secondary"
                            onClick={onShowAllClick}
                            css={`
                                && {
                                    border: 0;
                                    padding: 8px;
                                    width: 40px;
                                }
                            `}
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {!showAll ? (
                                    // eslint-disable-next-line max-len
                                    <path d="M15.879 11.794a.703.703 0 0 1 .915 1.062l-4.02 4.021-.093.083a1.093 1.093 0 0 1-1.455-.083l-4.02-4.02-.068-.08a.703.703 0 0 1 .068-.915l.079-.068a.703.703 0 0 1 .915.068l3.8 3.8 3.8-3.8zm.836-4.656l.08.068c.249.25.271.64.067.915l-.068.08-4.022 4.021a1.094 1.094 0 0 1-1.45.084l-.095-.085-4.021-4.02a.703.703 0 0 1 .915-1.063l.08.068L12 11.005l3.8-3.8a.704.704 0 0 1 .915-.067z" />
                                ) : (
                                    // eslint-disable-next-line max-len
                                    <path d="M8.121 12.404a.703.703 0 0 1-.99-.976l.075-.087 4.02-4.02.093-.083a1.093 1.093 0 0 1 1.362 0l.093.083 4.02 4.02.068.08c.182.244.184.58.007.827l-.075.088-.079.068a.704.704 0 0 1-.827.006l-.088-.074-3.8-3.8-3.8 3.8-.079.068zm-.836 4.656l-.08-.068a.703.703 0 0 1-.067-.916l.068-.079 4.022-4.021a1.094 1.094 0 0 1 1.45-.084l.095.085 4.021 4.02a.703.703 0 0 1-.915 1.063l-.08-.068-3.799-3.8-3.8 3.8a.703.703 0 0 1-.915.068z" />
                                )}
                            </svg>
                        </Button>
                        <Button kind="secondary" onClick={onCopyClick} disabled={!!disabled}>
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>
                }
                onSelect={setCurrentTab}
                selected={currentTab}
            >
                {items.map(([lang, label, snippet], index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Tabs.Item label={label} value={index} key={index}>
                        <div
                            css={`
                                ${!showAll && css`
                                    max-height: 265px;
                                    overflow: hidden;
                                `}
                            `}
                        >
                            {/*
                                toString() is needed because otherwise first item will not work because
                                of this check inside CodeSnippet: 'const idOrLanguage = id || language'
                            */}
                            <CodeSnippet id={index.toString()} language={lang} codeRef={codeRef}>
                                {snippet}
                            </CodeSnippet>
                        </div>
                    </Tabs.Item>
                ))}
            </Tabs>
        </div>
    )
}

export default CodeSnippets
