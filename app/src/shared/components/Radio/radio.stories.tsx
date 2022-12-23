import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import { Radio } from '.'
const stories = storiesOf('Shared/Radio', module).addDecorator(
    styles({
        color: '#323232',
        padding: '2rem',
    }),
)
stories.add('default', () => (
    <div>
        <form>
            <p>Default:</p>
            <Radio
                id="radio-example-option1"
                name={'important-selection'}
                label={'Some option'}
                value={'some-option'}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option2"
                name={'important-selection'}
                label={'Another option option'}
                value={'some-option2'}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option3"
                name={'important-selection'}
                label={'Something else'}
                value={'some-option3'}
                onChange={action('selected')}
            />
        </form>
        <form>
            <p>Disabled:</p>
            <Radio
                id="radio-example-option1=9998"
                name={'disabled-selection'}
                label={'Disabled but checked option'}
                value={'some-option-0000'}
                checked={true}
                disabled={true}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option848844"
                name={'disabled-selection'}
                label={'Disabled option'}
                value={'some-option-777'}
                onChange={action('selected')}
                disabled={true}
            />
        </form>
    </div>

))
