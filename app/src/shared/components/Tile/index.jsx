// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import { capital } from 'case'
import { ago } from '$shared/utils/time'
import { Translate } from 'react-redux-i18n'
import { DataUnionBadge, IconBadge, DeployingBadge } from './Badge'
import ImageContainer, { Image } from './ImageContainer'
import Menu from './Menu'
import Summary from './Summary'
import Label from './Label'
import { RunStates } from '$editor/canvas/state'
import CanvasPreview from '$editor/canvas/components/Preview'
import DashboardPreview from '$editor/dashboard/components/Preview'
import Link from '$shared/components/Link'
import { formatPath } from '$shared/utils/url'
import { isPaidProduct } from '$mp/utils/product'
import { timeUnits } from '$shared/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import links from '$app/src/links'

const Tile = styled.div`
    position: relative;

    ${Menu} {
        opacity: 0;
        pointer-events: none;
        transition-property: visibility, opacity;
        transition: 200ms;
        visibility: hidden;
    }

    ${Menu}.show,
    :hover ${Menu},
    :focus ${Menu} {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
    }

    ${({ suppressHover }) => !suppressHover && css`
        ${Image} {
            filter: brightness(100%);
            transition: 240ms ease-out filter;
        }

        ${Menu}.show + a ${Image},
        :hover ${Image} {
            filter: brightness(70%);
            transition-duration: 40ms;
        }
    `}
`

type ImageTileProps = {
    alt?: ?string,
    height?: any,
    showDataUnionBadge?: boolean,
    src?: ?string,
}

const ImageTile = ({
    alt,
    height,
    showDataUnionBadge,
    src,
    ...props
}: ImageTileProps) => (
    <Tile {...props} suppressHover>
        <ImageContainer
            alt={alt || ''}
            height={height}
            src={src || ''}
        >
            {!!showDataUnionBadge && (
                <DataUnionBadge top left />
            )}
        </ImageContainer>
    </Tile>
)

type CanvasTileProps = {
    canvas: any,
    onMenuToggle?: (boolean) => any,
    actions: any,
}

export const touchedAgo = ({ updated, created }: any): string => `
    ${updated === created ? 'Created' : 'Updated'} ${ago(new Date(updated))}
`

const CanvasTile = ({ canvas, onMenuToggle, actions, ...props }: CanvasTileProps) => (
    <Tile {...props}>
        <Menu onToggle={onMenuToggle}>
            {actions}
        </Menu>
        <Link to={`${links.editor.canvasEditor}/${canvas.id}`}>
            <ImageContainer>
                <Image
                    as={CanvasPreview}
                    canvas={canvas}
                />
            </ImageContainer>
            <Summary
                name={canvas.name}
                description={touchedAgo(canvas)}
                label={(
                    <Label positive={canvas.state === RunStates.Running}>
                        {capital(canvas.state)}
                    </Label>
                )}
            />
        </Link>
    </Tile>
)

type DashboardTileProps = {
    dashboard: any,
}

const DashboardTile = ({ dashboard, ...props }: DashboardTileProps) => (
    <Tile {...props}>
        <Link to={`${links.editor.dashboardEditor}/${dashboard.id}`}>
            <ImageContainer>
                <Image
                    as={DashboardPreview}
                    dashboard={dashboard}
                />
            </ImageContainer>
            <Summary
                name={dashboard.name}
                description={touchedAgo(dashboard)}
            />
        </Link>
    </Tile>
)

type PurchaseTileProps = {
    isSubActive?: boolean,
    numMembers?: number,
    product: any,
    showDataUnionBadge?: boolean,
    showDeployingBadge?: boolean,
}

const PurchaseTile = ({
    isSubActive,
    numMembers,
    product,
    showDataUnionBadge,
    showDeployingBadge,
    ...props
}: PurchaseTileProps) => (
    <Tile {...props}>
        <Link to={product.id && `${links.marketplace.products}/${product.id}`}>
            <ImageContainer src={product.imageUrl || ''}>
                {!!showDataUnionBadge && (
                    <DataUnionBadge top left />
                )}
                {typeof numMembers !== 'undefined' && (
                    <IconBadge icon="dataUnion" bottom right>
                        {numMembers}
                    </IconBadge>
                )}
                {!!showDeployingBadge && !!showDataUnionBadge && typeof numMembers === 'undefined' && (
                    <DeployingBadge bottom right />
                )}
            </ImageContainer>
            <Summary
                name={product.name}
                description={product.owner}
                label={(
                    <Label positive={isSubActive}>
                        {isSubActive ? (
                            <Translate value="userpages.purchases.active" />
                        ) : (
                            <Translate value="userpages.purchases.expired" />
                        )}
                    </Label>
                )}
            />
        </Link>
    </Tile>
)

type ProductTileProps = {
    actions?: any,
    deployed?: boolean,
    numMembers?: number,
    product: any,
    showDataUnionBadge?: boolean,
    showDeployingBadge?: boolean,
}

const getProductLink = (id: string) => (process.env.NEW_MP_CONTRACT ? (
    formatPath(links.userpages.products, id, 'edit')
) : (
    formatPath(links.marketplace.products, id)
))

const ProductTile = ({
    actions,
    deployed,
    numMembers,
    product,
    showDataUnionBadge,
    showDeployingBadge,
    ...props
}: ProductTileProps) => (
    <Tile {...props}>
        {!!actions && (
            <Menu>
                {actions}
            </Menu>
        )}
        <Link to={product.id && getProductLink(product.id)}>
            <ImageContainer src={product.imageUrl || ''}>
                {!!showDataUnionBadge && (
                    <DataUnionBadge top left />
                )}
                {typeof numMembers !== 'undefined' && !showDeployingBadge && (
                    <IconBadge bottom right icon="dataUnion">
                        {numMembers}
                    </IconBadge>
                )}
                {!!showDeployingBadge && (
                    <DeployingBadge bottom right />
                )}
            </ImageContainer>
            <Summary
                name={product.name}
                description={touchedAgo(product)}
                label={(
                    <Label positive={deployed}>
                        {deployed ? (
                            <Translate value="userpages.products.published" />
                        ) : (
                            <Translate value="userpages.products.draft" />
                        )}
                    </Label>
                )}
            />
        </Link>
    </Tile>
)

type MarketplaceProductTileProps = {
    product: any,
    showDataUnionBadge?: boolean,
}

const MarketplaceProductTile = ({ product, showDataUnionBadge, ...props }: MarketplaceProductTileProps) => (
    <Tile {...props}>
        <Link to={formatPath(links.marketplace.products, product.id || '')}>
            <ImageContainer src={product.imageUrl || ''}>
                {!!showDataUnionBadge && (
                    <DataUnionBadge top left />
                )}
                {!!showDataUnionBadge && typeof product.members !== 'undefined' && (
                    <IconBadge icon="dataUnion" bottom right>
                        {product.members}
                    </IconBadge>
                )}
            </ImageContainer>
            <Summary
                name={product.name}
                description={product.owner}
                label={isPaidProduct(product) ? (
                    <PaymentRate
                        amount={product.pricePerSecond}
                        currency={product.priceCurrency}
                        timeUnit={timeUnits.hour}
                        maxDigits={4}
                    />
                ) : (
                    <Translate value="productTile.free" />
                )}
            />
        </Link>
    </Tile>
)

export {
    CanvasTile,
    DashboardTile,
    ImageTile,
    MarketplaceProductTile,
    ProductTile,
    PurchaseTile,
}

export default Tile
