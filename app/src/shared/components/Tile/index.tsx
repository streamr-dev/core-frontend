import React from 'react'
import styled, { css } from 'styled-components'
import { Img } from 'react-image'
import { ago } from '$shared/utils/time'
import Logo from '$shared/components/Logo'
import Skeleton from '$shared/components/Skeleton'
import Rect from '$shared/components/Rect'
import Link from '$shared/components/Link'
import useExpiresIn, { formatRemainingTime } from '$shared/hooks/useExpiresIn'
import { formatChainName, getChainIdFromApiString } from '$shared/utils/chains'
import routes from '$routes'
import Label, { HAPPY, ANGRY, WORRIED } from './Label'
import Summary from './Summary'
import Menu from './Menu'
import { DataUnionBadge, DeployingBadge, ChainBadge as UnstyledChainBadge } from './Badge'

const Image = styled(Img)`
    img& {
        display: block;
        object-fit: cover;
    }
`
const Placeholder = styled.div`
    background-image: linear-gradient(135deg, #0045ff 0%, #7200ee 100%);

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

type ThumbnailProps = {
    src?: string | null | undefined
    skeletonize?: boolean
    alt?: string | null | undefined
}

const UnstyledThumbnail = ({ src, skeletonize, alt, ...props }: ThumbnailProps) =>
    src != null &&
    (skeletonize ? (
        <Image {...props} as={Skeleton} block />
    ) : (
        <Image
            {...props}
            alt={alt}
            src={src}
            loader={<Image {...props} as={Skeleton} block />}
            unloader={
                <Image {...props} as={Placeholder}>
                    <Logo color="black" opacity="0.15" />
                </Image>
            }
        />
    ))

export const TileThumbnail = styled(UnstyledThumbnail)<ThumbnailProps>`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`

type TileProps = {
    suppressHover?: boolean
}

const Tile = styled.div<TileProps>`
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

    ${({ suppressHover }) =>
        !suppressHover &&
        css`
            ${TileThumbnail} {
                filter: brightness(100%);
                transition: 240ms ease-out filter;
            }

            ${Menu}.show + a ${TileThumbnail},
        :hover ${TileThumbnail} {
                filter: brightness(70%);
                transition-duration: 40ms;
            }
        `}
`

type UnstyledTileImageContainerProps = {
    children?: any
    height?: string
    autoSize?: any
}

const UnstyledTileImageContainer = ({ children, height, autoSize: autoSizeProp, ...props }: UnstyledTileImageContainerProps) => {
    const autoSize = autoSizeProp === true || height != null
    return (
        <div {...props}>
            {children}
            {!!autoSize && <Rect height={height} />}
        </div>
    )
}

export const TileImageContainer = styled(UnstyledTileImageContainer)<UnstyledTileImageContainerProps>`
  border-radius: 16px;
  overflow: hidden;
  position: relative;

  & & {
    border-radius: 0;
    overflow: visible;
  }

  &.no-border-radius {
    border-radius: 0;
  }
`

type ImageTileProps = {
    alt?: string | null | undefined
    height?: any
    showDataUnionBadge?: boolean
    src?: string | null | undefined
    noBorderRadius?: boolean
}

const ImageTile = ({ alt, height, showDataUnionBadge, src, noBorderRadius, ...props }: ImageTileProps) => (
    <Tile {...props} suppressHover>
        <TileImageContainer autoSize height={height} className={noBorderRadius ? 'no-border-radius' : ''}>
            <TileThumbnail alt={alt || ''} src={src || ''} />
            {!!showDataUnionBadge && <DataUnionBadge top left />}
        </TileImageContainer>
    </Tile>
)

export const touchedAgo = ({ updated, created }: any): string => `
    ${updated === created ? 'Created' : 'Updated'} ${ago(new Date(updated))}
`
type PurchaseTileProps = {
    expiresAt: Date
    now?: Date | null | undefined
    numMembers?: number
    product: any
    showDataUnionBadge?: boolean
    showDeployingBadge?: boolean
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
    return <Label mood={mood}>{secondsLeft > 0 ? `Expires in ${formatRemainingTime(secondsLeft)}` : 'Expired'}</Label>
}

const ChainBadge = styled(UnstyledChainBadge)`
    visibility: hidden;
    transition-property: visibility;
    transition: 40ms;

    ${Tile}:hover & {
        visibility: visible;
    }
`

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
        <TileImageContainer>
            <Link
                to={
                    product.id &&
                    routes.marketplace.product.overview({
                        id: product.id,
                    })
                }
            >
                <TileImageContainer autoSize>
                    <TileThumbnail src={product.imageUrl || ''} />
                </TileImageContainer>
                {!!showDataUnionBadge && (
                    <DataUnionBadge
                        top
                        left
                        memberCount={numMembers}
                        linkTo={
                            product.id &&
                            routes.marketplace.product.overview(
                                {
                                    id: product.id,
                                },
                                'stats',
                            )
                        }
                    />
                )}
                {!!showDeployingBadge && <DeployingBadge bottom right />}
            </Link>
        </TileImageContainer>
        <Link
            to={
                product.id &&
                routes.marketplace.product.overview({
                    id: product.id,
                })
            }
        >
            <Summary
                name={product.name}
                description={product.owner}
            />
        </Link>
    </Tile>
)

type ProductTileProps = {
    actions?: any
    deployed?: boolean
    published?: boolean
    numMembers?: number
    product: any
    showDataUnionBadge?: boolean
    showDeployingBadge?: boolean
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
        {!!actions && <Menu>{actions}</Menu>}
        <TileImageContainer>
            <Link
                to={
                    product.id &&
                    routes.products.edit({
                        id: product.id,
                    })
                }
            >
                <TileImageContainer autoSize>
                    <TileThumbnail src={product.imageUrl || ''} />
                </TileImageContainer>
            </Link>
            {!!showDataUnionBadge && (
                <DataUnionBadge top left memberCount={numMembers} linkTo={routes.dataunions.index()} />
            )}
            {!!showDeployingBadge && <DeployingBadge bottom right />}
        </TileImageContainer>
        <Link
            to={
                product.id &&
                routes.products.edit({
                    id: product.id,
                })
            }
        >
            <Summary
                name={product.name}
                description={touchedAgo(product)}
            />
        </Link>
    </Tile>
)

type MarketplaceProductTileProps = {
    product: any
    showDataUnionBadge?: boolean
}

const MarketplaceProductTile = ({ product, showDataUnionBadge, ...props }: MarketplaceProductTileProps) => (
    <Tile {...props}>
        <TileImageContainer>
            <Link
                to={routes.marketplace.product.overview({
                    id: product.id,
                })}
            >
                <TileImageContainer autoSize>
                    <TileThumbnail src={product.imageUrl || ''} />
                </TileImageContainer>
            </Link>
            {!!showDataUnionBadge && (
                <DataUnionBadge
                    top
                    left
                    memberCount={product.members}
                    linkTo={routes.marketplace.product.overview(
                        {
                            id: product.id,
                        },
                        'stats',
                    )}
                />
            )}
            {product.chain != null && !product.isFree && (
                <ChainBadge
                    bottom
                    left
                    chainId={getChainIdFromApiString(product.chain)}
                    chainName={formatChainName(product.chain)}
                />
            )}
        </TileImageContainer>
        <Link
            to={routes.marketplace.product.overview({
                id: product.id,
            })}
        >
            <Summary
                name={product.metadata.name}
                description={product.metadata.description}
            />
        </Link>
    </Tile>
)

export { ImageTile, MarketplaceProductTile, ProductTile, PurchaseTile }
export default Tile
