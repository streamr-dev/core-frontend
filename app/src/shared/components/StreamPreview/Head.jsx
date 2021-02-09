import React from 'react'
import styled, { css } from 'styled-components'
import { SM, LG, REGULAR } from '$shared/utils/styled'
import Skeleton from '$shared/components/Skeleton'
import { truncate } from '$shared/utils/text'
import CloseButton from './CloseButton'
import Layout from './Layout'

const Prefix = styled.span`
    ::after {
        content: '→';
        padding: 0 0.5em;
    }
`

const Inner = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr;
    height: 72px;

    ${Layout.Pusher} + div {
        min-width: 0;
        padding: 0 16px;
    }

    h1 {
        font-size: 18px;
        font-weight: ${REGULAR};
        letter-spacing: 0.01em;
        line-height: normal;
        margin: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @media (min-width: ${LG}px) {
            font-size: 24px;
        }
    }

    h1 span:empty {
        display: none;
    }

    p {
        color: #a3a3a3;
        font-size: 12px;
        letter-spacing: 0.01em;
        line-height: normal;
        margin: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @media (min-width: ${LG}px) {
            font-size: 14px;
        }
    }

    h1,
    p {
        width: max-content;
    }

    p:empty {
        display: none;
    }

    @media (min-width: ${SM}px) {
        height: 56px;
    }

    @media (min-width: ${LG}px) {
        p {
            font-size: 14px;
        }
    }
`

const UnstyledHead = ({
    className,
    onCloseClick,
    streamId,
    skeletonize,
    titlePrefix,
    description,
}) => (
    <div className={className}>
        <CloseButton.Wrapper>
            <CloseButton onClick={onCloseClick} />
        </CloseButton.Wrapper>
        <Inner>
            <Layout.Pusher />
            <div>
                <h1 title={streamId}>
                    <Skeleton disabled={!skeletonize} width="70%">
                        <Prefix>{titlePrefix}</Prefix>
                        {truncate(streamId)}
                    </Skeleton>
                </h1>
                <p title={description}>
                    <Skeleton disabled={!skeletonize} width="50%">
                        {description}
                    </Skeleton>
                </p>
            </div>
        </Inner>
    </div>
)

const Head = styled(UnstyledHead)`
    background: #fdfdfd;
    flex: 0;
    position: relative;

    button + button {
        margin-left: 16px;
    }

    ${({ skeletonize }) => !!skeletonize && css`
        h1,
        p {
            width: auto;
        }
    `}
`

export default Head
