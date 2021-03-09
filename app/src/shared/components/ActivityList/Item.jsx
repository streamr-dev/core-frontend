import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import { resourceTypes } from '$shared/utils/Activity'
import AvatarImage from '$shared/components/AvatarImage'
import { ago } from '$shared/utils/time'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import resourcePath from '$shared/utils/resourcePath'
import { productTypes } from '$mp/utils/constants'
import { useResource } from './ActivityResourceProvider'
import { useIsPendingTransaction } from '.'

const Container = styled.div`
    display: grid;
    grid-template-columns: 32px auto;
    grid-column-gap: 16px;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    padding: 16px;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f8f8f8;
    }
`

const ImageContainer = styled.div`
    max-height: 32px;
`

const StyledSpinner = styled(Spinner)`
    position: relative;
    top: -24px;
    left: 8px;
`

const StyledAvatarImage = styled(AvatarImage)`
    height: 32px;
    border-radius: ${(props) => (props.circle ? '50%' : '4px')};
    overflow: hidden;
    filter: ${(props) => (props.isLoading ? 'brightness(70%)' : 'none')};
`

const TextContent = styled.div`
    display: grid;
    grid-template-rows: auto 18px;
    font-size: 14px;
    line-height: 18px;
`

const Text = styled.div`
    min-height: 18px;
    max-height: 36px;
    overflow: hidden;
    color: #323232;

    // && is used to increase specificity so we can break free from parent
    // styles without using !important
    // https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
    && a {
        display: contents;
        padding: 0;
        background-color: transparent;
        font-weight: 500;
        line-height: 18px;
        white-space: normal;
    }

    ${Container}:hover && a {
        color: #0324FF;
    }
`

const truncate = (input, maxLength) => (input.length > maxLength ? `${input.substring(0, maxLength)}...` : input)

const ResourceImage = ({ resource, resourceType, isLoading }) => {
    const currentUser = useSelector(selectUserData)

    switch (resourceType) {
        case resourceTypes.PRODUCT:
            return resource ? (
                <StyledAvatarImage name={resource.name} src={resource.imageUrl} isLoading={isLoading} />
            ) : (
                <SvgIcon name="product" />
            )
        case resourceTypes.CANVAS:
            return <SvgIcon name="canvas" />
        case resourceTypes.STREAM:
            return <SvgIcon name="stream" />
        default:
            return !!currentUser && (
                <StyledAvatarImage name={currentUser.name} isLoading={isLoading} circle />
            )
    }
}

const actionVerbs = {
    ADD: 'was added',
    CREATE: 'was created',
    UPDATE: 'was updated',
    SUBSCRIPTION: 'was subscribed',
    PUBLISH: 'was published',
    UNPUBLISH: 'was unpublished',
    DEPLOY: 'was deployed',
}

const Item = ({ activity }) => {
    const { resourceType, resourceId, timestamp } = activity

    const hasPendingTx = useIsPendingTransaction(activity.txHash)

    const href = resourcePath(resourceType, resourceId)

    const resource = useResource(resourceType, resourceId)

    return (
        <Container>
            <ImageContainer>
                <ResourceImage
                    resource={resource}
                    resourceType={resourceType}
                    isLoading={hasPendingTx}
                />
                {hasPendingTx && (
                    <StyledSpinner color="white" size="small" />
                )}
            </ImageContainer>
            <TextContent>
                <Text>
                    {resource && href ? (
                        <a href={href}>
                            {truncate(resource.name || '', 75)}
                        </a>
                    ) : (
                        resourceId || ''
                    )}
                    {' '}
                    {actionVerbs[activity.action]}
                </Text>
                <div
                    // eslint-disable-next-line react/jsx-curly-brace-presence
                    css={`
                        color: #a3a3a3;
                        font-size: 12px;
                    `}
                >
                    <span
                        // eslint-disable-next-line react/jsx-curly-brace-presence
                        css={`
                            color: #323232;
                        `}
                    >
                        {resourceType === resourceTypes.PRODUCT && resource &&
                        resource.type === productTypes.DATAUNION && 'Data Union'}
                        {resourceType === resourceTypes.PRODUCT &&
                        resource && resource.type === productTypes.NORMAL && 'Data Product'}
                        {resourceType === resourceTypes.CANVAS && 'Canvas'}
                        {resourceType === resourceTypes.STREAM && 'Stream'}
                    </span>
                    {' '}
                    {!!timestamp && ago(new Date(timestamp))}
                </div>
            </TextContent>
        </Container>
    )
}

export default Item
