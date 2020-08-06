// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import { titleize } from '@streamr/streamr-layout'
import ReactImage from 'react-image'
import { ago } from '$shared/utils/time'
import { Translate, I18n } from 'react-redux-i18n'
import Logo from '$shared/components/Logo'
import Badge, { DataUnionBadge, IconBadge, DeployingBadge } from './Badge'
import Skeleton from '$shared/components/Skeleton'
import Rect from '$shared/components/Rect'
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

const Image = styled(ReactImage)`
    img& {
        display: block;
        object-fit: cover;
    }
`

const Placeholder = styled.div`
    background-image: linear-gradient(135deg, #0045FF 0%, #7200EE 100%);

    ${Logo} {
        height: auto;
        left: 50%;
        max-width: 32%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
    }
`

const UnstyledThumbnail = ({ src, skeletonize, alt, ...props }) => (
    src != null && (
        skeletonize ? (
            <Image
                {...props}
                as={Skeleton}
                block
            />
        ) : (
            <Image
                {...props}
                alt={alt}
                src={src}
                loader={(
                    <Image
                        {...props}
                        as={Skeleton}
                        block
                    />
                )}
                unloader={(
                    <Image
                        {...props}
                        as={Placeholder}
                    >
                        <Logo color="black" opacity="0.15" />
                    </Image>
                )}
            />
        )
    )
)

const Thumbnail = styled(UnstyledThumbnail)`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`

const Tile = styled.div`
    position: relative;

    ${Menu} {
        opacity: 0;
        pointer-events: none;
        transition-property: visibility, opacity;
        transition: 200ms;
        visibility: hidden;
    }

    ${Link}:not(${Badge}) {
        display: block;
    }

    ${Menu}.show,
    :hover ${Menu},
    :focus ${Menu} {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
    }

    ${({ suppressHover }) => !suppressHover && css`
        ${Thumbnail} {
            filter: brightness(100%);
            transition: 240ms ease-out filter;
        }

        ${Menu}.show + a ${Thumbnail},
        :hover ${Thumbnail} {
            filter: brightness(70%);
            transition-duration: 40ms;
        }
    `}
`

const UnstyledImageContainer = ({
    children,
    ratio,
    height,
    autoSize: autoSizeProp,
    ...props
}) => {
    const autoSize = autoSizeProp === true || height != null || ratio != null

    return (
        <div {...props}>
            {children}
            {!!autoSize && (
                <Rect
                    height={height}
                    ratio={ratio}
                />
            )}
        </div>
    )
}

const ImageContainer = styled(UnstyledImageContainer)`
    border-radius: 2px;
    border-radius: ${({ theme }) => theme.borderRadius};
    overflow: hidden;
    position: relative;

    & & {
        border-radius: 0;
        overflow: visible;
    }
`

Object.assign(Tile, {
    ImageContainer,
    Thumbnail,
})

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
        <Tile.ImageContainer autoSize height={height}>
            <Tile.Thumbnail
                alt={alt || ''}
                src={src || ''}
            />
            {!!showDataUnionBadge && (
                <DataUnionBadge top left />
            )}
        </Tile.ImageContainer>
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
            <Tile.ImageContainer autoSize>
                <Tile.Thumbnail
                    as={CanvasPreview}
                    canvas={canvas}
                />
            </Tile.ImageContainer>
            <Summary
                name={canvas.name}
                description={touchedAgo(canvas)}
                label={(
                    <Label mood={canvas.state === RunStates.Running && HAPPY}>
                        {titleize(canvas.state)}
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
            <Tile.ImageContainer autoSize>
                <Tile.Thumbnail
                    as={DashboardPreview}
                    dashboard={dashboard}
                />
            </Tile.ImageContainer>
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
                I18n.t('userpages.subscriptions.expiresIn', {
                    time: formatRemainingTime(secondsLeft),
                })
            ) : (
                I18n.t('userpages.subscriptions.expired')
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
        <Tile.ImageContainer>
            <Link
                to={product.id && routes.marketplace.product({
                    id: product.id,
                })}
            >
                <Tile.ImageContainer autoSize>
                    <Tile.Thumbnail src={product.imageUrl || ''} />
                </Tile.ImageContainer>
                {!!showDataUnionBadge && (
                    <DataUnionBadge top left />
                )}
                {typeof numMembers !== 'undefined' && (
                    <IconBadge
                        icon="dataUnion"
                        bottom
                        right
                        forwardAs={Badge.Link}
                        to={product.id && routes.marketplace.product({
                            id: product.id,
                        }, 'stats')}
                    >
                        {numMembers}
                    </IconBadge>
                )}
                {!!showDeployingBadge && !!showDataUnionBadge && typeof numMembers === 'undefined' && (
                    <DeployingBadge bottom right />
                )}
            </Link>
        </Tile.ImageContainer>
        <Link
            to={product.id && routes.marketplace.product({
                id: product.id,
            })}
        >
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
        <Tile.ImageContainer>
            <Link
                to={product.id && routes.products.edit({
                    id: product.id,
                })}
            >
                <Tile.ImageContainer autoSize>
                    <Tile.Thumbnail src={product.imageUrl || ''} />
                </Tile.ImageContainer>
            </Link>
            {!!showDataUnionBadge && (
                <DataUnionBadge top left />
            )}
            {typeof numMembers !== 'undefined' && !showDeployingBadge && (
                <IconBadge
                    bottom
                    right
                    icon="dataUnion"
                    forwardAs={Badge.Link}
                    to={product.id && routes.products.stats({
                        id: product.id,
                    })}
                >
                    {numMembers}
                </IconBadge>
            )}
            {!!showDeployingBadge && (
                <DeployingBadge bottom right />
            )}
        </Tile.ImageContainer>
        <Link
            to={product.id && routes.products.edit({
                id: product.id,
            })}
        >
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
        <Tile.ImageContainer>
            <Link
                to={routes.marketplace.product({
                    id: product.id,
                })}
            >
                <Tile.ImageContainer autoSize>
                    <Tile.Thumbnail src={product.imageUrl || ''} />
                </Tile.ImageContainer>
            </Link>
            {!!showDataUnionBadge && (
                <DataUnionBadge top left />
            )}
            {!!showDataUnionBadge && typeof product.members !== 'undefined' && (
                <IconBadge
                    icon="dataUnion"
                    bottom
                    right
                    forwardAs={Badge.Link}
                    to={routes.marketplace.product({
                        id: product.id,
                    }, 'stats')}
                >
                    {product.members}
                </IconBadge>
            )}
        </Tile.ImageContainer>
        <Link
            to={routes.marketplace.product({
                id: product.id,
            })}
        >
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
