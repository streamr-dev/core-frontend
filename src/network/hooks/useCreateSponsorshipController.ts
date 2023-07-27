import { getWalletAccount, useWalletAccount } from '~/shared/stores/wallet'
import getCoreConfig from '~/getters/getCoreConfig'
import { getCustomTokenBalance, getTokenInformation } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { useCallback, useEffect, useState } from 'react'
import { CreateSponsorshipFormData } from '~/modals/CreateSponsorshipModal'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import uniqueId from 'lodash/uniqueId'
import { toaster, Toaster } from 'toasterhea'
import { Layer } from '~/utils/Layer'
import { createSponsorship } from '~/services/sponsorships'
import { toBN } from '~/utils/bn'

export type BalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
} | null

export const useCreateSponsorshipController = (): {
    balanceData: BalanceForSponsorship | undefined
    handleSponsorshipFormSubmit: (formData: CreateSponsorshipFormData) => Promise<void>
} => {
    const walletConnected = !!useWalletAccount()
    const [balanceData, setBalanceData] = useState<BalanceForSponsorship>()

    const handleSponsorshipFormSubmit = useCallback(
        async (formData: CreateSponsorshipFormData) => {
            if (!balanceData) {
                return
            }

            const toast: Toaster<typeof TransactionListToast> | undefined = toaster(
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
                /*await createSponsorship({
                    minOperatorCount: Number(formData.minNumberOfOperators),
                    maxOperatorCount: formData.maxNumberOfOperators
                        ? Number(formData.maxNumberOfOperators)
                        : undefined,
                    minimumStakeTime: toBN(formData.minStakeDuration).multipliedBy(86400),
                    payoutRate: toBN(formData.payoutRate)
                        .dividedBy(86400)
                        .multipliedBy(balanceData.tokenDecimals),
                    initialFunding: toBN(formData.initialAmount).multipliedBy(
                        balanceData.tokenDecimals,
                    ),
                    streamId: formData.streamId,
                    metadata: {},
                })*/
                await new Promise((resolve, reject) => {
                    setTimeout(reject, 1000)
                })
                console.log('MOCK success!')
                deploymentOperation.state = 'complete'
            } catch (e) {
                console.log('MOCK error!')
                deploymentOperation.state = 'error'
                throw new Error('Failed to deploy the sponsorship')
            } finally {
                setTimeout(() => toast.discard(), 3000)
            }
        },
        [balanceData],
    )

    const getBalanceData = useCallback(async () => {
        const wallet = await getWalletAccount()
        if (!wallet) {
            return null
        }
        const tokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken as string
        const tokenInformation = await getTokenInformation(
            defaultChainConfig.contracts[tokenSymbolFromConfig],
        )
        if (!tokenInformation) {
            throw new Error('Invalid token for sponsorship balanance')
        }
        const balance = await getCustomTokenBalance(
            defaultChainConfig.contracts[tokenSymbolFromConfig],
            wallet,
        )
        setBalanceData({
            balance: balance.toString(),
            tokenSymbol: tokenInformation.symbol,
            tokenDecimals: Number(tokenInformation.decimals.toString()),
        })
    }, [setBalanceData])

    useEffect(() => {
        getBalanceData()
    }, [walletConnected])

    return {
        balanceData,
        handleSponsorshipFormSubmit,
    }
}
