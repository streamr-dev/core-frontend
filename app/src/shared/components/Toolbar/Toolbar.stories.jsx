// @flow

import React, { Fragment, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import Toolbar from '.'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'

const Content = styled.div`
    height: 1000px;
`

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
    }))
    .addDecorator(withKnobs)

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
        disabled: boolean('disabled'),
        spinner: boolean('spinner'),
    },
}

story('Toolbar').addWithJSX('basic', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))

const Autoscrolled = (props: any) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 16)
        }
    }, [])

    return <div {...props} />
}

story('Toolbar').addWithJSX('basic scrolled down', () => (
    <Autoscrolled>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Autoscrolled>
))

story('Toolbar')
    .addParameters({
        viewport: {
            defaultViewport: 'xs',
        },
    })
    .addWithJSX('basic mobile', () => (
        <Fragment>
            <Toolbar
                actions={toolbarActions}
                altMobileLayout
            />
            <Content>Lorem ipsum dolor sit emat.</Content>
        </Fragment>
    ))

story('Toolbar').addWithJSX('left status text', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
            left={text('status text', 'status')}
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))

story('Toolbar').addWithJSX('middle icon', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
            left={text('status text', 'status')}
            middle={<SvgIcon
                name="user"
                style={{
                    width: '40px',
                    height: '40px',
                }}
            />}
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))

