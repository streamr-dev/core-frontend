import { toaster, Toaster } from 'toasterhea'
import uniqueId from 'lodash/uniqueId'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'
import { createSponsorship } from '~/services/sponsorships'
import { toBN } from '~/utils/bn'
import {
    getTokenAndBalanceForSponsorship,
    TokenAndBalanceForSponsorship,
} from '../getters/getTokenAndBalanceForSponsorship'
import { CreateSponsorshipForm } from '../forms/createSponsorshipForm'

export const handleSponsorshipCreation = async (
    formData: CreateSponsorshipForm,
    balanceData: TokenAndBalanceForSponsorship,
) => {
    const toast: Toaster<typeof TransactionListToast> = toaster(
        TransactionListToast,
        Layer.Toast,
    )

    const deploymentOperation: Operation = {
        id: uniqueId('sponsorship-deployment-'),
        label: 'Sponsorship deployment',
        state: 'ongoing',
    }
    const operations = [deploymentOperation]
    notify(toast, operations)

    try {
        await createSponsorship({
            minOperatorCount: Number(formData.minNumberOfOperators),
            maxOperatorCount: formData.maxNumberOfOperators
                ? Number(formData.maxNumberOfOperators)
                : undefined,
            minimumStakeTime: toBN(formData.minStakeDuration).multipliedBy(86400),
            payoutRate: toBN(formData.payoutRate)
                .dividedBy(86400)
                .multipliedBy(Math.pow(10, balanceData.tokenDecimals)),
            initialFunding: toBN(formData.initialAmount).multipliedBy(
                Math.pow(10, balanceData.tokenDecimals),
            ),
            streamId: formData.streamId,
            metadata: {},
        })
        deploymentOperation.state = 'complete'
        notify(toast, operations)
    } catch (e) {
        console.warn(e)
        deploymentOperation.state = 'error'
        notify(toast, operations)
        throw new Error('Failed to deploy the sponsorship')
    } finally {
        setTimeout(() => toast.discard(), 3000)
    }
}
