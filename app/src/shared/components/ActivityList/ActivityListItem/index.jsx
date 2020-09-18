// @flow

import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import Activity, { resourceTypes } from '$shared/utils/Activity'
import Avatar from '$shared/components/Avatar'
import { ago } from '$shared/utils/time'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import resourcePath from '$shared/utils/resourcePath'
import { productTypes } from '$mp/utils/constants'
import { selectPendingTransactions } from '$mp/modules/transactions/selectors'

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

const StyledAvatar = styled(Avatar)`
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

const Details = styled.div`
    color: #a3a3a3;
    font-size: 12px;
`

const Type = styled.span`
    color: #323232;
`

type Props = {
    activity: Activity,
    user?: any,
    resource?: any, // Product | Canvas | Stream
}

const truncate = (input: string, maxLength: number) => (input.length > maxLength ? `${input.substring(0, maxLength)}...` : input)

const ResourceLink = ({ id, type, children }) => {
    // $FlowFixMe type is STREAM, PRODUCT, or CANVAS. Nothing else here.
    const href = resourcePath(type, id)

    return href ? (
        <a href={href}>
            {children}
        </a>
    ) : (
        id || ''
    )
}

const renderContent = (activity, resource, resourceType) => {
    switch (resourceType) {
        case resourceTypes.STREAM:
        case resourceTypes.PRODUCT:
        case resourceTypes.CANVAS:
            return (
                <React.Fragment>
                    {resource ? (
                        <ResourceLink id={activity.resourceId} type={resourceType}>
                            {truncate(resource.name || '', 75)}
                        </ResourceLink>
                    ) : (
                        activity.resourceId
                    )}
                    {' '}
                    {I18n.t(`shared.action.${activity.action.toLowerCase()}`)}
                </React.Fragment>
            )
        default:
            return activity.action
    }
}

const renderImage = (activity, user, resource, resourceType, isLoading) => {
    if (resourceType === resourceTypes.PRODUCT && resource) {
        if (resource.imageUrl) {
            return <StyledAvatar alt={resource.name} src={resource.imageUrl} isLoading={isLoading} />
        }
        return <SvgIcon name="product" />
    }
    if (resourceType === resourceTypes.CANVAS) {
        return <SvgIcon name="canvas" />
    }
    if (resourceType === resourceTypes.STREAM) {
        return <SvgIcon name="stream" />
    }
    if (user) {
        return <StyledAvatar alt={user.name} isLoading={isLoading} circle />
    }
    return null
}

const renderType = (resource, resourceType) => {
    if (resourceType === resourceTypes.PRODUCT && resource && resource.type === productTypes.DATAUNION) {
        return I18n.t('general.dataUnion')
    }
    if (resourceType === resourceTypes.PRODUCT && resource && resource.type === productTypes.NORMAL) {
        return I18n.t('general.dataProduct')
    }
    if (resourceType === resourceTypes.CANVAS) {
        return I18n.t('general.canvas')
    }
    if (resourceType === resourceTypes.STREAM) {
        return I18n.t('general.stream')
    }
    return null
}

const ActivityListItem = ({ activity, user, resource }: Props) => {
    const pendingTxs = useSelector(selectPendingTransactions)

    const isTxPending = activity.txHash && pendingTxs.some((item) => item.hash === activity.txHash && item.state === 'pending')

    const { resourceType } = activity

    return (
        <Container>
            <ImageContainer>
                {renderImage(activity, user, resource, resourceType, isTxPending)}
                {isTxPending && (
                    <StyledSpinner color="white" size="small" />
                )}
            </ImageContainer>
            <TextContent>
                <Text>{renderContent(activity, resource, resourceType)}</Text>
                <Details>
                    <Type>{renderType(resource, resourceType)}</Type>
                    &nbsp;
                    {activity.timestamp ? ago(new Date(activity.timestamp)) : null}
                </Details>
            </TextContent>
        </Container>
    )
}

export default ActivityListItem
