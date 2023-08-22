import React from 'react'
import { toaster } from 'toasterhea'
import Button from '~/shared/components/Button'
import Layout from '~/components/Layout'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { PageWrap } from '~/shared/components/PageWrap'
import { Layer } from '~/utils/Layer'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)

export default function OperatorsPage() {
    return (
        <Layout pageTitle="Operators">
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
                <br />
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
                <br />
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
                <br />
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await createSponsorshipModal.pop()
                        } catch (e) {
                            // Ignore for now.
                        }
                    }}
                >
                    Create Sponsorship
                </Button>
                <br />
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await joinSponsorshipModal.pop()
                        } catch (e) {
                            // Ignore for now.
                        }
                    }}
                >
                    Join Sponsorship as Operator
                </Button>
            </PageWrap>
        </Layout>
    )
}
