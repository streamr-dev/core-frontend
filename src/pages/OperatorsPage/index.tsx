import React from 'react'
import { toaster } from 'toasterhea'
import Button from '$app/src/shared/components/Button'
import { MarketplaceHelmet } from '$app/src/shared/components/Helmet'
import Layout from '$app/src/shared/components/Layout'
import LoadingIndicator from '$app/src/shared/components/LoadingIndicator'
import { PageWrap } from '$app/src/shared/components/PageWrap'
import { Layer } from '$app/src/utils/Layer'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)

export default function OperatorsPage() {
    return (
        <Layout gray>
            <MarketplaceHelmet title="Streams" />
            <LoadingIndicator />
            <PageWrap>
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await becomeOperatorModal.pop()
                        } catch (e) {
                            // Ignore for now.
                        }
                    }}
                >
                    Become an Operator
                </Button>
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await delegateFundsModal.pop()
                        } catch (e) {
                            // Ignore for now.
                        }
                    }}
                >
                    Delegate
                </Button>
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await fundSponsorshipModal.pop()
                        } catch (e) {
                            // Ignore for now.
                        }
                    }}
                >
                    Fund
                </Button>
            </PageWrap>
        </Layout>
    )
}
