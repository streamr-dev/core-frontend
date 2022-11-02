import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { SM, MD, LG, XL } from '$shared/utils/styled'
import Toolbar from '.'
const Content = styled.div`
    height: 1000px;
`

const story = (name) =>
    storiesOf(`Shared/${name}`, module)
        .addDecorator(
            styles({
                color: '#323232',
            }),
        )

const toolbarActions = {
    cancel: {
        title: 'Cancel',
        kind: 'link',
        onClick: action('cancel'),
    },
    ok: {
        title: 'Ok',
        kind: 'primary',
        onClick: action('ok'),
        disabled: false,
        spinner: false,
    },
}
story('Toolbar')
    .addParameters({
        chromatic: {
            // Take 5 snapshots
            viewports: [SM - 1, SM, MD, LG, XL],
        },
    })
    .add('basic', () => (
        <Fragment>
            <Toolbar actions={toolbarActions} altMobileLayout />
            <Content>Lorem ipsum dolor sit emat.</Content>
        </Fragment>
    ))
story('Toolbar').add('left status text', () => (
    <Fragment>
        <Toolbar actions={toolbarActions} altMobileLayout left={'status'} />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))
story('Toolbar').add('middle icon', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            left={'status'}
            altMobileLayout
            middle={
                <SvgIcon
                    name="user"
                    style={{
                        width: '40px',
                        height: '40px',
                    }}
                />
            }
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))
story('Toolbar').add('loading', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            left={'status'}
            loading
            altMobileLayout
            middle={
                <SvgIcon
                    name="user"
                    style={{
                        width: '40px',
                        height: '40px',
                    }}
                />
            }
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))
