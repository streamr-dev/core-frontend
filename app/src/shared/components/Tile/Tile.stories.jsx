import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import sample from './sample.stories.png'
import { DeployingBadge, DataUnionBadge, SharedBadge, IconBadge } from './Badge'
import Grid from './Grid'
import Summary from './Summary'
import Menu, { MenuItem } from './Menu'
import Tile, { touchedAgo, PurchaseTile } from './'

const stories = storiesOf('Shared/Tile', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '16px',
    }))
    .addDecorator(withKnobs)

stories.add('placeholder only', () => (
    <Grid>
        <Tile.ImageContainer autoSize>
            <Tile.Thumbnail src="" />
        </Tile.ImageContainer>
    </Grid>
))

stories.add('with sample image', () => (
    <Grid>
        <Tile>
            <Tile.ImageContainer autoSize>
                <Tile.Thumbnail src={sample} />
            </Tile.ImageContainer>
        </Tile>
    </Grid>
))

stories.add('with sample image and badge', () => (
    <Grid>
        <Tile>
            <Tile.ImageContainer autoSize>
                <Tile.Thumbnail src={sample} />
                <DataUnionBadge top left />
                <DeployingBadge bottom right />
                <SharedBadge bottom left />
                <IconBadge icon="dataUnion" top right>
                    15
                </IconBadge>
            </Tile.ImageContainer>
        </Tile>
    </Grid>
))

stories.add('elastic grid', () => (
    <Grid>
        {[...Array(5)].map((i, index) => (
            // eslint-disable-next-line react/no-array-index-key
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
                    <Tile.ImageContainer autoSize>
                        <Tile.Thumbnail skeletonize={boolean('Skeletonize')} src={sample} />
                    </Tile.ImageContainer>
                    <Summary
                        skeletonize={boolean('Skeletonize')}
                        name="Helsinki Tram Network GPS"
                        description={touchedAgo({
                            created: new Date('2020-01-01'),
                            updated: new Date('2020-01-02'),
                        })}
                        label={(
                            <div>Draft</div>
                        )}
                    />
                </a>
            </Tile>
        ))}
    </Grid>
))

const now = new Date()

stories.add('purchase tile', () => (
    <Grid>
        <PurchaseTile
            expiresAt={new Date(now.getTime() + (299 * 1000))}
            now={now}
            numMembers={10}
            product={{
                imageUrl: sample,
                name: 'Product that expires in <5 minutes',
            }}
            showDataUnionBadge
        />
        <PurchaseTile
            expiresAt={new Date(now.getTime() + (3599 * 1000))}
            now={now}
            product={{
                imageUrl: sample,
                name: 'Product that expires in <1hr',
            }}
            showDataUnionBadge
            showDeployingBadge
        />
        <PurchaseTile
            expiresAt={new Date(now.getTime() + (3601 * 1000))}
            now={now}
            product={{
                imageUrl: sample,
                name: 'Product that expires in 1hr+',
            }}
        />
        <PurchaseTile
            expiresAt={now}
            now={now}
            product={{
                imageUrl: sample,
                name: 'Expired product',
            }}
        />
    </Grid>
))
