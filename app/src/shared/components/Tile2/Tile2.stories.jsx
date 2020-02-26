import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import sample from './sample.stories.png'
import { DeployingBadge, DataUnionBadge, SharedBadge, IconBadge } from './Badge'
import ImageContainer from './ImageContainer'
import Grid from './Grid'
import Summary from './Summary'
import Menu, { MenuItem } from './Menu'
import Tile from './'

const stories = storiesOf('Shared/Tile (new)', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '16px',
    }))
    .addDecorator(withKnobs)

stories.add('placeholder only', () => (
    <Tile>
        <ImageContainer />
    </Tile>
))

stories.add('with sample image', () => (
    <Tile>
        <ImageContainer src={sample} />
    </Tile>
))

stories.add('with sample image and badge', () => (
    <Tile>
        <ImageContainer src={sample}>
            <DataUnionBadge top left />
            <DeployingBadge bottom right />
            <SharedBadge bottom left />
            <IconBadge icon="dataUnion" top right>
                15
            </IconBadge>
        </ImageContainer>
    </Tile>
))

stories.add('elastic grid', () => (
    <Grid>
        <Tile>
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
                <ImageContainer skeletonize={boolean('Skeletonize')} src={sample} />
                <Summary
                    skeletonize={boolean('Skeletonize')}
                    name="Helsinki Tram Network GPS"
                    updatedAt={new Date('2020-01-01').getDate()}
                    label={(
                        <div>Draft</div>
                    )}
                />
            </a>
        </Tile>
        <Tile>
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
                <ImageContainer skeletonize={boolean('Skeletonize')} src={sample} />
                <Summary
                    skeletonize={boolean('Skeletonize')}
                    name="Helsinki Tram Network GPS"
                    updatedAt={new Date('2020-01-01').getDate()}
                    label={(
                        <div>Draft</div>
                    )}
                />
            </a>
        </Tile>
        <Tile>
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
                <ImageContainer skeletonize={boolean('Skeletonize')} src={sample} />
                <Summary
                    skeletonize={boolean('Skeletonize')}
                    name="Helsinki Tram Network GPS"
                    updatedAt={new Date('2020-01-01').getDate()}
                    label={(
                        <div>Draft</div>
                    )}
                />
            </a>
        </Tile>
        <Tile>
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
                <ImageContainer skeletonize={boolean('Skeletonize')} src={sample} />
                <Summary
                    skeletonize={boolean('Skeletonize')}
                    name="Helsinki Tram Network GPS"
                    updatedAt={new Date('2020-01-01').getDate()}
                    label={(
                        <div>Draft</div>
                    )}
                />
            </a>
        </Tile>
        <Tile>
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
                <ImageContainer skeletonize={boolean('Skeletonize')} src={sample} />
                <Summary
                    skeletonize={boolean('Skeletonize')}
                    name="Helsinki Tram Network GPS"
                    updatedAt={new Date('2020-01-01').getDate()}
                    label={(
                        <div>Draft</div>
                    )}
                />
            </a>
        </Tile>
    </Grid>
))
