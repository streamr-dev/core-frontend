// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

import routes from '$routes'

type Props = {
    accountsExist?: boolean,
    accountLinked?: boolean,
}

const NoTransactionsView = ({ accountsExist, accountLinked }: Props) => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
        link={(!accountsExist || !accountLinked) && (
            <Link
                className="btn btn-special"
                to={routes.editProfile({}, 'ethereum-accounts')}
            >
                <Translate value="userpages.transactions.noAccountsLinked.linkAccount" />
            </Link>
        )}
    >
        {(() => {
            if (!accountsExist) {
                return (
                    <React.Fragment>
                        <Translate value="userpages.transactions.noAccountsLinked.title" />
                        <Translate value="userpages.transactions.noAccountsLinked.message" tag="small" />
                    </React.Fragment>
                )
            } else if (!accountLinked) {
                return (
                    <React.Fragment>
                        <Translate value="userpages.transactions.currentAccountNotLinked.title" />
                        <Translate value="userpages.transactions.currentAccountNotLinked.message" tag="small" />
                    </React.Fragment>
                )
            }

            return (
                <React.Fragment>
                    <Translate value="userpages.transactions.noTransactions.title" />
                    <Translate value="userpages.transactions.noTransactions.message" tag="small" />
                </React.Fragment>
            )
        })()}
    </EmptyState>
)

export default NoTransactionsView
