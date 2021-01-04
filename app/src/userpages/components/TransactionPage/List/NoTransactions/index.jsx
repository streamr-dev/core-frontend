// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import Button from '$shared/components/Button'
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
            <Button
                kind="special"
                tag={Link}
                to={routes.profile({}, 'ethereum-accounts')}
            >
                <Translate value="userpages.transactions.noAccountsLinked.linkAccount" />
            </Button>
        )}
    >
        {(() => {
            if (!accountsExist) {
                return (
                    <p>
                        <Translate value="userpages.transactions.noAccountsLinked.title" />
                        <Translate value="userpages.transactions.noAccountsLinked.message" tag="small" />
                    </p>
                )
            } else if (!accountLinked) {
                return (
                    <p>
                        <Translate value="userpages.transactions.currentAccountNotLinked.title" />
                        <Translate value="userpages.transactions.currentAccountNotLinked.message" tag="small" />
                    </p>
                )
            }

            return (
                <p>
                    <Translate value="userpages.transactions.noTransactions.title" />
                    <Translate value="userpages.transactions.noTransactions.message" tag="small" />
                </p>
            )
        })()}
    </EmptyState>
)

export default NoTransactionsView
