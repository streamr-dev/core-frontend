import { AbiCoder, Contract, ContractTransactionReceipt, EventLog } from 'ethers'
import { ERC677, Operator } from 'network-contracts-ethers6'
import { DayInSeconds } from '~/consts'
import { CreateSponsorshipForm } from '~/forms/createSponsorshipForm'
import { getParsedSponsorshipById } from '~/getters'
import { useUncollectedEarningsStore } from '~/shared/stores/uncollectedEarnings'
import { getSigner, getWalletWeb3Provider } from '~/shared/stores/wallet'
import { toBigInt, toBN } from '~/utils/bn'
import { getContractAbi, getContractAddress } from '~/utils/contracts'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicProvider } from '~/utils/providers'
import { toastedOperation } from '~/utils/toastedOperation'
import { call, CallableOptions } from '~/utils/tx'

export async function createSponsorship(
    chainId: number,
    formData: CreateSponsorshipForm,
    { onReceipt }: CallableOptions = {},
): Promise<string> {
    const {
        dailyPayoutRate,
        initialAmount,
        maxNumberOfOperators,
        minNumberOfOperators,
        minStakeDuration,
        streamId,
    } = formData

    const payoutRatePerSecond = toBigInt(toBN(dailyPayoutRate).dividedBy(DayInSeconds))

    const minStakeDurationInSeconds = minStakeDuration * DayInSeconds

    const policies: [string, string | 0][] = [
        [
            getContractAddress('sponsorshipStakeWeightedAllocationPolicy', chainId),
            `${payoutRatePerSecond}`,
        ],
        [
            getContractAddress('sponsorshipDefaultLeavePolicy', chainId),
            `${minStakeDurationInSeconds}`,
        ],
        [getContractAddress('sponsorshipVoteKickPolicy', chainId), 0],
    ]

    if (maxNumberOfOperators !== undefined) {
        policies.push([
            getContractAddress('sponsorshipMaxOperatorsJoinPolicy', chainId),
            `${maxNumberOfOperators}`,
        ])
    }

    await networkPreflight(chainId)

    return new Promise<string>((resolve, reject) => {
        void (async () => {
            try {
                await toastedOperation('Sponsorship deployment', async () => {
                    const data = AbiCoder.defaultAbiCoder().encode(
                        ['uint32', 'string', 'string', 'address[]', 'uint[]'],
                        [
                            minNumberOfOperators,
                            streamId,
                            JSON.stringify({}), // metadata
                            policies.map(([policy]) => policy),
                            policies.map(([, param]) => param),
                        ],
                    )

                    const provider = await getWalletWeb3Provider()

                    const signer = await getSigner()

                    const token = new Contract(
                        getContractAddress('sponsorshipPaymentToken', chainId),
                        getContractAbi('erc677'),
                        signer,
                    ) as unknown as ERC677

                    await call(token, 'transferAndCall', {
                        args: [
                            getContractAddress('sponsorshipFactory', chainId),
                            initialAmount,
                            data,
                        ],
                        onReceipt: async (rawReceipt) => {
                            /**
                             * ContractTransactionReceipt converts some logs (Log) into
                             * event logs (EventLog) – something we need later on to detect
                             * transfer events.
                             */
                            const receipt = new ContractTransactionReceipt(
                                token.interface,
                                provider,
                                rawReceipt,
                            )

                            /**
                             * 2nd transfer is the transfer from the sponsorship factory to the newly
                             * deployed sponsorship contract.
                             */
                            const [, transfer = undefined] = (receipt.logs.filter(
                                (item) =>
                                    'eventName' in item && item.eventName === 'Transfer',
                            ) || []) as EventLog[]

                            const sponsorshipId = transfer?.args.to

                            if (typeof sponsorshipId !== 'string') {
                                throw new Error('Sponsorship deployment failed')
                            }

                            await onReceipt?.(receipt)

                            resolve(sponsorshipId)
                        },
                    })
                })
            } catch (e) {
                reject(e)
            }
        })()
    })
}

export async function fundSponsorship(
    chainId: number,
    sponsorshipId: string,
    amount: bigint,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        getContractAddress('sponsorshipPaymentToken', chainId),
        getContractAbi('erc677'),
        signer,
    ) as unknown as ERC677

    await toastedOperation('Sponsorship funding', async () => {
        await call(contract, 'transferAndCall', {
            args: [sponsorshipId, amount, '0x'],
            onReceipt,
        })
    })
}

interface StakeOnSponsorshipOptions extends CallableOptions {
    toastLabel?: string
}

export async function stakeOnSponsorship(
    chainId: number,
    sponsorshipId: string,
    amount: bigint,
    operatorAddress: string,
    options: StakeOnSponsorshipOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const { toastLabel = 'Stake on sponsorship', onReceipt } = options

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(
            operatorAddress,
            getContractAbi('operator'),
            signer,
        ) as unknown as Operator

        await call(contract, 'stake', {
            args: [sponsorshipId, amount],
            onReceipt,
        })

        /**
         * @todo The following rate updating logic does not belong here! Move
         * it outside and call after `stakeOnSponsorship` (this util) calls.
         */

        /**
         * Update uncollected earnings because the rate of change will change
         * along with stake amount.
         */
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()

        await updateEarnings(chainId, operatorAddress)
    })
}

interface ReduceStakeOnSponsorshipOptions extends CallableOptions {
    toastLabel?: string
}

export async function reduceStakeOnSponsorship(
    chainId: number,
    sponsorshipId: string,
    targetAmount: bigint,
    operatorAddress: string,
    options: ReduceStakeOnSponsorshipOptions = {},
): Promise<void> {
    const { toastLabel = 'Reduce stake on sponsorship', onReceipt } = options

    await networkPreflight(chainId)

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(
            operatorAddress,
            getContractAbi('operator'),
            signer,
        ) as unknown as Operator

        await call(contract, 'reduceStakeTo', {
            args: [sponsorshipId, targetAmount],
            onReceipt,
        })

        /**
         * @todo The following rate updating logic does not belong here! Move
         * it outside and call after `reduceStakeOnSponsorship` (this util) calls.
         */

        /**
         * Update uncollected earnings because the rate of change will change
         * along with stake amount.
         */
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()

        await updateEarnings(chainId, operatorAddress)
    })
}

export async function forceUnstakeFromSponsorship(
    chainId: number,
    sponsorshipId: string,
    operatorAddress: string,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    await toastedOperation('Force unstake from sponsorship', async () => {
        const signer = await getSigner()

        const contract = new Contract(
            operatorAddress,
            getContractAbi('operator'),
            signer,
        ) as unknown as Operator

        /**
         * @todo What is `maxQueuePayoutIterations`? Ask @jtakalai for details.
         */
        const maxQueuePayoutIterations = 1000000

        await call(contract, 'forceUnstake', {
            args: [sponsorshipId, maxQueuePayoutIterations],
            onReceipt,
        })

        /**
         * @todo The following rate updating logic does not belong here! Move
         * it outside and call after `forceUnstakeFromSponsorship` (this util) calls.
         */

        /**
         * Update uncollected earnings because the rate of change will change
         * along with stake amount.
         */
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()

        await updateEarnings(chainId, operatorAddress)
    })
}

export interface SponsorshipEarnings {
    uncollectedEarnings: bigint
    changePerSecond: bigint
}

export async function getEarningsForSponsorships(
    chainId: number,
    operatorAddress: string,
): Promise<Record<string, SponsorshipEarnings>> {
    const provider = await getPublicProvider(chainId)

    const contract = new Contract(
        operatorAddress,
        getContractAbi('operator'),
        provider,
    ) as unknown as Operator

    const { addresses, earnings } = await contract.getSponsorshipsAndEarnings()

    const result: Record<string, SponsorshipEarnings> = {}

    for (let i = 0; i < addresses.length; i++) {
        const sponsorshipId = addresses[i].toLowerCase()

        const sponsorship = await getParsedSponsorshipById(chainId, sponsorshipId)

        if (!sponsorship) {
            result[sponsorshipId] = {
                uncollectedEarnings: earnings[i],
                changePerSecond: 0n,
            }

            continue
        }

        const myStake =
            sponsorship.stakes.find(
                (s) => s.operatorId.toLowerCase() === operatorAddress.toLowerCase(),
            )?.amountWei || 0n

        const { totalStakedWei, payoutPerSecond, isRunning, remainingBalanceWei } =
            sponsorship

        const isSponsorshipPaying = isRunning && remainingBalanceWei > 0n

        const totalPayoutPerSecond = isSponsorshipPaying ? payoutPerSecond : 0n

        const myPayoutPerSecond =
            totalStakedWei > 0n
                ? toBigInt(
                      toBN(myStake)
                          .dividedBy(toBN(totalStakedWei))
                          .multipliedBy(toBN(totalPayoutPerSecond)),
                  )
                : 0n

        result[sponsorshipId] = {
            uncollectedEarnings: earnings[i],
            changePerSecond: myPayoutPerSecond,
        }
    }

    return result
}

export async function collectEarnings(
    chainId: number,
    sponsorshipId: string,
    operatorAddress: string,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        operatorAddress,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Collect earnings', async () => {
        await call(contract, 'withdrawEarningsFromSponsorships', {
            args: [[sponsorshipId]],
            onReceipt,
        })

        /**
         * @todo The following rate updating logic does not belong here! Move
         * it outside and call after `collectEarnings` (this util) calls.
         */

        /**
         * Update uncollected earnings because the rate of change will change
         * along with stake amount.
         */
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()

        await updateEarnings(chainId, operatorAddress)
    })
}
