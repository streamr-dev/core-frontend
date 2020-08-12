import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import ProductStat from '.'

const stories =
    storiesOf('Shared/Stat', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '1rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

// const stats = [{
//     id: 'revenue',
//     unit: 'DATA',
//     value: '123',
// }, {
//     id: 'members',
//     value: '500',
// }, {
//     id: 'averageRevenue',
//     unit: 'DATA',
//     value: '5.12',
// }, {
//     id: 'subscribers',
//     value: '34500',
// }, {
//     id: 'revenueShare',
//     unit: '%',
//     value: '40',
// }, {
//     id: 'created',
//     value: '08/10/2019',
// }]

// stories.add('header', () => (
//     <div>
//         <Values.Header>header</Values.Header>
//         <div>content</div>
//     </div>
// ))

// stories.add('value', () => (
//     <Values.Value {...stats[0]} />
// ))

// stories.add('values', () => (
//     <Values stats={stats} />
// ))

// stories.add('mobile', () => (
//     <Values stats={stats} />
// ), {
//     viewport: {
//         defaultViewport: 'sm',
//     },
// })

// stories.add('tablet', () => (
//     <Values stats={stats} />
// ), {
//     viewport: {
//         defaultViewport: 'md',
//     },
// })

// stories.add('loading', () => (
//     <Values stats={stats.map((stat) => ({
//         ...stat,
//         loading: true,
//     }))}
//     />
// ))
