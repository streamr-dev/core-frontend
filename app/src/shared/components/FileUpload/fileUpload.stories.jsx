// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { array, number } from '@storybook/addon-knobs'

import FileUpload from '.'

const stories = storiesOf('Shared/FileUpload', module)
    .addDecorator(styles({
        color: '#323232',
        fontSize: '16px',
    }))

stories.add('default', () => (
    <FileUpload
        component={<span>Drag a file here or click to browse</span>}
        dropTargetComponent={<span>Drop here!</span>}
        dragOverComponent={<span>Yay, just drop it!</span>}
        onFilesAccepted={action('onFilesAccepted')}
        onError={action('onError')}
        acceptMime={array('acceptMime', ['image/jpeg', 'image/png'])}
        maxFileSizeInMB={number('maxFileSizeInMB', 5)}
        multiple={false}
        disablePreview
    />
))
