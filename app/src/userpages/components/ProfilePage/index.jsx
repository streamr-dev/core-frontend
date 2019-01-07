// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

import Layout from '../Layout'
import ProfileSettings from './ProfileSettings'
import APICredentials from './APICredentials'
import IntegrationKeyHandler from './IntegrationKeyHandler'
import IdentityHandler from './IdentityHandler/index'
import DeleteAccount from './DeleteAccount'

import Toolbar from '$shared/components/Toolbar'
import TOCPage from '$userpages/components/TOCPage'
import styles from './profilePage.pcss'

export default class ProfilePage extends Component<{}> {
    render() {
        return (
            <Layout noHeader>
                <div className={styles.profilePage}>
                    <Toolbar actions={{
                        cancel: {
                            title: I18n.t('userpages.profilePage.toolbar.cancel'),
                            outline: true,
                            linkTo: '/u',
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveChanges'),
                            color: 'primary',
                        },
                    }}
                    />
                    <div className="container">
                        <TOCPage title={I18n.t('userpages.profilePage.pageTitle')}>
                            <TOCPage.Section id="profile" title={I18n.t('userpages.profilePage.profile.title')}>
                                <ProfileSettings />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="api-keys"
                                title={I18n.t('userpages.profilePage.apiCredentials.title')}
                                linkTitle={I18n.t('userpages.profilePage.apiCredentials.linkTitle')}
                            >
                                <APICredentials />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="ethereum-accounts"
                                title={I18n.t('userpages.profilePage.ethereumAddress.title')}
                                linkTitle={I18n.t('userpages.profilePage.ethereumAddress.linkTitle')}
                            >
                                <IdentityHandler />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="private-keys"
                                title={I18n.t('userpages.profilePage.ethereumPrivateKeys.title')}
                                linkTitle={I18n.t('userpages.profilePage.ethereumPrivateKeys.linkTitle')}
                            >
                                <IntegrationKeyHandler />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="delete-account"
                                title={I18n.t('userpages.profilePage.deleteAccount.title')}
                                linkTitle={I18n.t('userpages.profilePage.deleteAccount.linkTitle')}
                            >
                                <DeleteAccount />
                            </TOCPage.Section>
                        </TOCPage>
                    </div>
                </div>
            </Layout>
        )
    }
}
