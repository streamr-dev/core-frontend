// @flow

import React, { useState } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import Activity from '$shared/utils/Activity'
import { hasTransactionCompleted } from '$shared/utils/web3'
import Avatar from '$shared/components/Avatar'
import { ago } from '$shared/utils/time'
import useInterval from '$shared/hooks/useInterval'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import routes from '$routes'
import usePending from '$shared/hooks/usePending'
import { productTypes } from '$mp/utils/constants'

const Container = styled.div`
    display: grid;
    grid-template-columns: 32px auto;
    grid-column-gap: 16px;
    width: 100%;
    border: 1px solid #f5f5f5;
    padding: 16px;

    &:not(:last-child) {
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
        display: inline-block;
        padding: 0;
        background-color: transparent;
        font-weight: 500;
        line-height: 18px;
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
    stream?: any,
    product?: any,
    canvas?: any,
}

const renderItem = (action: string, linkTitle: ?string, linkHref: ?string, id: string) => (
    <React.Fragment>
        {linkHref != null ? (
            <a
                href={linkHref}
            >
                {linkTitle}
            </a>
        ) : (
            id
        )}
        &nbsp;
        {I18n.t(`shared.action.${action.toLowerCase()}`)}
    </React.Fragment>
)

const renderStreamItem = (id, stream, action) => (
    renderItem(
        action,
        stream && stream.name,
        stream && routes.userPageStreamShow({
            streamId: stream.id,
        }),
        id,
    )
)

const renderProductItem = (id, product, action) => (
    renderItem(
        action,
        product && product.name,
        product && routes.editProduct({
            id: product.id,
        }),
        id,
    )
)

const renderCanvasItem = (id, canvas, action) => (
    renderItem(
        action,
        canvas && canvas.name,
        canvas && routes.canvasEdit({
            id: canvas.id,
        }),
        id,
    )
)

const renderContent = (activity, stream, product, canvas) => {
    if (activity.streamId != null) {
        return renderStreamItem(activity.streamId, stream, activity.action)
    }
    if (activity.productId != null) {
        return renderProductItem(activity.productId, product, activity.action)
    }
    if (activity.canvasId != null) {
        return renderCanvasItem(activity.canvasId, canvas, activity.action)
    }
    return activity.action
}

const renderImage = (activity, user, stream, product, canvas, isLoading) => {
    if (product) {
        return <StyledAvatar alt={product.name} src={product.imageUrl} isLoading={isLoading} />
    }
    if (canvas) {
        return <SvgIcon name="canvas" />
    }
    if (stream) {
        return <SvgIcon name="stream" />
    }
    if (user) {
        return <StyledAvatar alt={user.name} isLoading={isLoading} circle />
    }
    return null
}

const renderType = (stream, product, canvas) => {
    if (product && product.type === productTypes.DATAUNION) {
        return I18n.t('general.dataUnion')
    }
    if (product && product.type === productTypes.NORMAL) {
        return I18n.t('general.dataProduct')
    }
    if (canvas) {
        return I18n.t('general.canvas')
    }
    if (stream) {
        return I18n.t('general.stream')
    }
    return null
}

const ActivityListItem = ({
    activity,
    user,
    stream,
    product,
    canvas,
}: Props) => {
    const [isTxCompleted, setTxCompleted] = useState(false)
    const showSpinner = activity.txHash && !isTxCompleted
    const { wrap, isPending } = usePending(`checktx.${activity.id}`)

    useInterval(() => {
        const checkTxCompleted = async (txHash) => {
            wrap(async () => {
                const result = await hasTransactionCompleted(txHash)
                setTxCompleted(result)
            })
        }

        if (activity.txHash && !isPending) {
            checkTxCompleted(activity.txHash)
        }
    }, activity.txHash && !isTxCompleted ? 100 : null)

    return (
        <Container>
            <ImageContainer>
                {renderImage(activity, user, stream, product, canvas, showSpinner)}
                {showSpinner && (
                    <StyledSpinner color="white" size="small" />
                )}
            </ImageContainer>
            <TextContent>
                <Text>{renderContent(activity, stream, product, canvas)}</Text>
                <Details>
                    <Type>{renderType(stream, product, canvas)}</Type>
                    &nbsp;
                    {activity.timestamp ? ago(new Date(activity.timestamp)) : null}
                </Details>
            </TextContent>
        </Container>
    )
}

export default ActivityListItem
