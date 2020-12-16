import React from 'react'
import styled from 'styled-components'
import { SM, LG, REGULAR } from '$shared/utils/styled'
import CloseButton from './CloseButton'
import Skeleton from '$shared/components/Skeleton'
import Layout from './Layout'

const Inner = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr;
    height: 72px;

    h1 {
        font-size: 18px;
        font-weight: ${REGULAR};
        letter-spacing: 0.01em;
        line-height: normal;
        margin: 0;

        @media (min-width: ${LG}px) {
            font-size: 24px;
        }
    }

    h1 span:empty {
        display: none;
    }

    h1 span:not(:last-child)::after {
        content: '&rarr;';
        padding: 0 1em;
    }

    p {
        color: #a3a3a3;
        font-size: 12px;
        letter-spacing: 0.01em;
        line-height: normal;
        margin: 0;

        @media (min-width: ${LG}px) {
            font-size: 14px;
        }
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
                    <Skeleton disabled={!skeletonize}>
                        <span>{titlePrefix}</span>
                        {streamId}
                    </Skeleton>
                </h1>
                <p title={description}>
                    <Skeleton disabled={!skeletonize}>
                        {description}
                    </Skeleton>
                </p>
            </div>
        </Inner>
    </div>
)

const Head = styled(UnstyledHead)`
    flex: 0;
    position: relative;

    button + button {
        margin-left: 16px;
    }
`

export default Head
