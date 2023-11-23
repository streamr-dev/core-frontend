import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import sample from './sample.stories.png'
import { DeployingBadge, DataUnionBadge, SharedBadge, BadgeLink } from './Badge'
import Grid from './Grid'
import Summary from './Summary'
import Menu, { MenuItem } from './Menu'
import Tile, { touchedAgo, TileImageContainer, TileThumbnail } from './index'

export const PlaceholderOnly = () => (
    <Grid>
        <TileImageContainer autoSize>
            <TileThumbnail src="" />
        </TileImageContainer>
    </Grid>
)

PlaceholderOnly.story = {
    name: 'placeholder only',
}

const meta: Meta<typeof PlaceholderOnly> = {
    title: 'Shared/Tile',
    component: PlaceholderOnly,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '16px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const WithSampleImage = () => (
    <Grid>
        <Tile>
            <TileImageContainer autoSize>
                <TileThumbnail src={sample} />
            </TileImageContainer>
        </Tile>
    </Grid>
)

WithSampleImage.story = {
    name: 'with sample image',
}

export const WithSampleImageAndBadge = () => (
    <Grid>
        <Tile>
            <TileImageContainer autoSize>
                <TileThumbnail src={sample} />
                <DataUnionBadge top left memberCount={16} linkHref="http://google.com" />
                <DeployingBadge bottom right />
                <SharedBadge bottom left />
            </TileImageContainer>
        </Tile>
    </Grid>
)

WithSampleImageAndBadge.story = {
    name: 'with sample image and badge',
}

export const FixedThumbnailHeight = () => (
    <Grid>
        <Tile>
            <Menu>
                <MenuItem>Item #1</MenuItem>
                <MenuItem>Item #2</MenuItem>
                <MenuItem>Item #3</MenuItem>
                <MenuItem>Item #4</MenuItem>
                <MenuItem>Item #5</MenuItem>
            </Menu>
            <TileImageContainer>
                <a
                    href="/resource/1403"
                    onClick={(e) => {
                        e.preventDefault()
                        action('Navigate!')()
                    }}
                >
                    <TileImageContainer height="144px">
                        <TileThumbnail skeletonize={true} src={sample} />
                    </TileImageContainer>
                </a>
                <DataUnionBadge top left memberCount={16} />
                <DeployingBadge bottom right />
            </TileImageContainer>
        </Tile>
    </Grid>
)

FixedThumbnailHeight.story = {
    name: 'fixed thumbnail height',
}

export const SquareThumbnails = () => (
    <Grid>
        <Tile>
            <Menu>
                <MenuItem>Item #1</MenuItem>
                <MenuItem>Item #2</MenuItem>
                <MenuItem>Item #3</MenuItem>
                <MenuItem>Item #4</MenuItem>
                <MenuItem>Item #5</MenuItem>
            </Menu>
            <TileImageContainer>
                <a
                    href="/resource/1403"
                    onClick={(e) => {
                        e.preventDefault()
                        action('Navigate!')()
                    }}
                >
                    <TileImageContainer>
                        <TileThumbnail skeletonize={true} src={sample} />
                    </TileImageContainer>
                </a>
                <DataUnionBadge top left memberCount={16} />
                <DeployingBadge bottom right />
            </TileImageContainer>
        </Tile>
    </Grid>
)

SquareThumbnails.story = {
    name: 'square thumbnails',
}

export const WithDataUnionBadgeBeingALink = () => (
    <Grid>
        <Tile>
            <Menu>
                <MenuItem>Item #1</MenuItem>
                <MenuItem>Item #2</MenuItem>
                <MenuItem>Item #3</MenuItem>
                <MenuItem>Item #4</MenuItem>
                <MenuItem>Item #5</MenuItem>
            </Menu>
            <TileImageContainer>
                <a
                    href="/resource/1403"
                    onClick={(e) => {
                        e.preventDefault()
                        action('Navigate!')()
                    }}
                >
                    <TileImageContainer autoSize>
                        <TileThumbnail skeletonize={true} src={sample} />
                    </TileImageContainer>
                </a>
                <DataUnionBadge
                    top
                    left
                    as={BadgeLink}
                    href="https://google.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    memberCount={16}
                />
            </TileImageContainer>
        </Tile>
    </Grid>
)

WithDataUnionBadgeBeingALink.story = {
    name: 'with Data Union badge being a link',
}

export const ElasticGrid = () => (
    <Grid>
        {[...Array(5)].map(
            (
                i,
                index, // eslint-disable-next-line react/no-array-index-key
            ) => (
                <Tile key={index}>
                    <Menu>
                        <MenuItem>Item #1</MenuItem>
                        <MenuItem>Item #2</MenuItem>
                        <MenuItem>Item #3</MenuItem>
                        <MenuItem>Item #4</MenuItem>
                        <MenuItem>Item #5</MenuItem>
                    </Menu>
                    <a
                        href="/resource/1403"
                        onClick={(e) => {
                            e.preventDefault()
                            action('Navigate!')()
                        }}
                    >
                        <TileImageContainer autoSize>
                            <TileThumbnail skeletonize={true} src={sample} />
                        </TileImageContainer>
                        <Summary
                            skeletonize={true}
                            name="Helsinki Tram Network GPS"
                            description={touchedAgo({
                                created: new Date('2020-01-01'),
                                updated: new Date('2020-01-02'),
                            })}
                            label={<div>Draft</div>}
                        />
                    </a>
                </Tile>
            ),
        )}
    </Grid>
)

ElasticGrid.story = {
    name: 'elastic grid',
}
