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
import Label, { HAPPY, ANGRY, WORRIED } from './Label'
import { RunStates } from '$editor/canvas/state'
import CanvasPreview from '$editor/canvas/components/Preview'
import DashboardPreview from '$editor/dashboard/components/Preview'
import Link from '$shared/components/Link'
import { isPaidProduct } from '$mp/utils/product'
import { timeUnits } from '$shared/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import useExpiresIn, { formatRemainingTime } from '$shared/hooks/useExpiresIn'
import routes from '$routes'

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
        <Link
            to={routes.canvases.edit({
                id: canvas.id,
            })}
        >
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
                    <Label mood={canvas.state === RunStates.Running && HAPPY}>
                        {capital(canvas.state)}
                    </Label>
                )}
            />
        </Link>
    </Tile>
)

type DashboardTileProps = {
    dashboard: any,
    onMenuToggle?: (boolean) => any,
    actions: any,
}

const DashboardTile = ({ dashboard, onMenuToggle, actions, ...props }: DashboardTileProps) => (
    <Tile {...props}>
        <Menu onToggle={onMenuToggle}>
            {actions}
        </Menu>
        <Link
            to={routes.dashboards.edit({
                id: dashboard.id,
            })}
        >
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
    expiresAt: Date,
    now?: ?Date,
    numMembers?: number,
    product: any,
    showDataUnionBadge?: boolean,
    showDeployingBadge?: boolean,
}

const remainingTimeToMood = (value: number) => {
    switch (true) {
        case value <= 0:
            return undefined
        case value < 300:
            return ANGRY
        case value < 3600:
            return WORRIED
        default:
            return HAPPY
    }
}

const ExpirationLabel = ({ expiresAt, now }: any) => {
    const secondsLeft = useExpiresIn(expiresAt, now)
    const mood = remainingTimeToMood(secondsLeft)

    return (
        <Label mood={mood}>
            {secondsLeft > 0 ? (
                `Expires in ${formatRemainingTime(secondsLeft)}`
            ) : (
                'Expired'
            )}
        </Label>
    )
}

const PurchaseTile = ({
    expiresAt,
    now,
    numMembers,
    product,
    showDataUnionBadge,
    showDeployingBadge,
    ...props
}: PurchaseTileProps) => (
    <Tile {...props}>
        <Link
            to={product.id && routes.marketplace.product({
                id: product.id,
            })}
        >
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
                    <ExpirationLabel expiresAt={expiresAt} now={now} />
                )}
            />
        </Link>
    </Tile>
)

type ProductTileProps = {
    actions?: any,
    deployed?: boolean,
    published?: boolean,
    numMembers?: number,
    product: any,
    showDataUnionBadge?: boolean,
    showDeployingBadge?: boolean,
}

const ProductTile = ({
    actions,
    deployed,
    published,
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
        <Link
            to={product.id && routes.products.edit({
                id: product.id,
            })}
        >
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
                    <Label mood={published && HAPPY}>
                        {!!published && (
                            <Translate value="userpages.products.published" />
                        )}
                        {!published && !!deployed && (
                            <Translate value="userpages.products.deployed" />
                        )}
                        {!published && !deployed && (
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
        <Link
            to={routes.marketplace.product({
                id: product.id,
            })}
        >
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
