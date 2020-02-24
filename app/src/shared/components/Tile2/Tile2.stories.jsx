import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import sample from './sample.png'
import { DeployingBadge, DataUnionBadge, SharedBadge } from './Badge'
import Image from './Image'
import Tile, { Grid } from './'

const stories = storiesOf('Shared/Tile (new)', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '16px',
    }))
    .addDecorator(withKnobs)

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
        </Image>
    </Tile>
))

stories.add('elastic grid', () => (
    <Grid>
        <Tile>
            <Image src={sample} />
        </Tile>
        <Tile>
            <Image src={sample} />
        </Tile>
        <Tile>
            <Image src={sample} />
        </Tile>
        <Tile>
            <Image src={sample} />
        </Tile>
        <Tile>
            <Image src={sample} />
        </Tile>
    </Grid>
))
