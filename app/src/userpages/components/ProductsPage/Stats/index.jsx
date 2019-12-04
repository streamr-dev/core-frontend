// @flow

import React from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'

import CoreLayout from '$shared/components/Layout/Core'
import Header from '../Header'
import ListContainer from '$shared/components/Container/List'

import styles from './stats.pcss'

const Stats = () => (
    <CoreLayout
        footer={false}
        hideNavOnDesktop
        navComponent={(
            <Header />
        )}
    >
        <Helmet title={`Streamr Core | ${I18n.t('userpages.title.products')}`} />
        <ListContainer>
            stats!
        </ListContainer>
    </CoreLayout>
)

export default Stats
