// @flow

import React from 'react'
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
                alt="Not found"
            />
        )}
        link={(!accountsExist || !accountLinked) && (
            <Button
                kind="special"
                tag={Link}
                to={routes.profile({}, 'ethereum-accounts')}
            >
                Link account
            </Button>
        )}
    >
        {(() => {
            if (!accountsExist) {
                return (
                    <p>
                        <span>Account not linked.</span>
                        <small>
                            You need to link an Ethereum account to see your transaction history.
                        </small>
                    </p>
                )
            } else if (!accountLinked) {
                return (
                    <p>
                        <span>Account not linked.</span>
                        <small>
                            You need to link the current Ethereum account to see your transaction history.
                        </small>
                    </p>
                )
            }

            return (
                <p>
                    <span>No transactions.</span>
                    <small>
                        You haven&apos;t made any transactions yet.
                    </small>
                </p>
            )
        })()}
    </EmptyState>
)

export default NoTransactionsView
