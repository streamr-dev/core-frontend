import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import sample from './sample.png'
import { DeployingBadge, DataUnionBadge, SharedBadge, IconBadge } from './Badge'
import Image from './Image'
import Grid from './Grid'
import Summary from './Summary'
import Tile from './'

const stories = storiesOf('Shared/Tile (new)', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '16px',
    }))

stories.add('placeholder only', () => (
    <Tile>
        <Image />
    </Tile>
))

stories.add('with sample image', () => (
    <Tile>
        <Image src={sample} />
    </Tile>
))

stories.add('with sample image and badge', () => (
    <Tile>
        <Image src={sample}>
            <DataUnionBadge top left />
            <DeployingBadge bottom right />
            <SharedBadge bottom left />
            <IconBadge icon="dataUnion" top right>
                15
            </IconBadge>
        </Image>
    </Tile>
))

stories.add('elastic grid', () => (
    <Grid>
        <Tile>
            <Image src={sample} />
            <Summary
                name="Helsinki Tram Network GPS"
                updatedAt={new Date('2020-01-01').getDate()}
                label={(
                    <div>Draft</div>
                )}
            />
        </Tile>
        <Tile>
            <Image src={sample} />
            <Summary
                name="Helsinki Tram Network GPS"
                updatedAt={new Date('2020-01-01').getDate()}
                label={(
                    <div>Draft</div>
                )}
            />
        </Tile>
        <Tile>
            <Image src={sample} />
            <Summary
                name="Helsinki Tram Network GPS"
                updatedAt={new Date('2020-01-01').getDate()}
                label={(
                    <div>Draft</div>
                )}
            />
        </Tile>
        <Tile>
            <Image src={sample} />
            <Summary
                name="Helsinki Tram Network GPS"
                updatedAt={new Date('2020-01-01').getDate()}
                label={(
                    <div>Draft</div>
                )}
            />
        </Tile>
        <Tile>
            <Image src={sample} />
            <Summary
                name="Helsinki Tram Network GPS"
                updatedAt={new Date('2020-01-01').getDate()}
                label={(
                    <div>Draft</div>
                )}
            />
        </Tile>
    </Grid>
))
