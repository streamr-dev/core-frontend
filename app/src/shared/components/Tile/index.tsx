import React from 'react'
import styled, { css } from 'styled-components'
import { Img } from 'react-image'
import { ago } from '$shared/utils/time'
import Logo from '$shared/components/Logo'
import Skeleton from '$shared/components/Skeleton'
import Rect from '$shared/components/Rect'
import Link from '$shared/components/Link'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import { TheGraphProject } from '$app/src/services/projects'
import routes from '$routes'
import Label, { HAPPY, ANGRY, WORRIED } from './Label'
import Summary from './Summary'
import Menu from './Menu'
import { DataUnionBadge, DeployingBadge } from './Badge'

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

const EditButton = styled(Link)`
    border: none;
    border-radius: 100%;
    background-color: white;
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    svg {
        color: ${COLORS.primary};
    }
`

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

    &:hover {
        ${EditButton} {
            opacity: 1;
        }
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

type ProductTileProps = {
    actions?: any
    deployed?: boolean
    published?: boolean
    numMembers?: number
    product: any
    showDataUnionBadge?: boolean
    showDeployingBadge?: boolean
}

const ProductTile = ({ actions, deployed, published, numMembers, product, showDataUnionBadge, showDeployingBadge, ...props }: ProductTileProps) => (
    <Tile {...props}>
        {!!actions && <Menu>{actions}</Menu>}
        <TileImageContainer>
            <Link
                to={
                    product.id &&
                    routes.projects.edit({
                        id: product.id,
                    })
                }
            >
                <TileImageContainer autoSize>
                    <TileThumbnail src={product.imageUrl || ''} />
                </TileImageContainer>
            </Link>
            {!!showDataUnionBadge && <DataUnionBadge top left memberCount={numMembers} linkTo={routes.projects.index()} />}
            {!!showDeployingBadge && <DeployingBadge bottom right />}
        </TileImageContainer>
        <Link
            to={
                product.id &&
                routes.projects.edit({
                    id: product.id,
                })
            }
        >
            <Summary name={product.name} description={touchedAgo(product)} />
        </Link>
    </Tile>
)

type MarketplaceProductTileProps = {
    product: TheGraphProject
    showDataUnionBadge?: boolean
    showEditButton: boolean
}

const MarketplaceProductTile = ({ product, showDataUnionBadge, showEditButton, ...props }: MarketplaceProductTileProps) => (
    <Tile {...props}>
        <TileImageContainer>
            <Link
                to={routes.projects.overview({
                    id: product.id,
                })}
            >
                <TileImageContainer autoSize>
                    <TileThumbnail src={(product.metadata && product.metadata.imageUrl) || ''} />
                </TileImageContainer>
            </Link>
            {!!showDataUnionBadge && (
                <DataUnionBadge
                    top
                    left
                    memberCount={product.members}
                    linkTo={routes.projects.overview(
                        {
                            id: product.id,
                        },
                        'stats',
                    )}
                />
            )}
            {showEditButton && (
                <EditButton to={routes.projects.edit({ id: product.id })}>
                    <SvgIcon name={'pencilFull'} />
                </EditButton>
            )}
        </TileImageContainer>
        <Link
            to={routes.projects.overview({
                id: product.id,
            })}
        >
            <Summary
                name={(product.metadata && product.metadata.name) || 'Untitled project'}
                description={(product.metadata && product.metadata.creator) || ''}
            />
        </Link>
    </Tile>
)

export { ImageTile, MarketplaceProductTile, ProductTile }
export default Tile
