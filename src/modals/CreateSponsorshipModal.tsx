import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { toaster, Toaster } from 'toasterhea'
import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'
import uniqueId from 'lodash/uniqueId'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    FormModalProps,
    Group,
    GroupHeadline,
    Hint,
    Section,
    SectionHeadline,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui//Label'
import { toBN } from '~/utils/bn'
import { FieldWrap, TextAppendix, TextInput } from '~/components/TextInput'
import { SearchDropdown } from '~/components/SearchDropdown'
import {
    checkIfStreamExists,
    getPagedStreams,
    TheGraphOrderBy,
    TheGraphOrderDirection,
    TheGraphStreamResult,
} from '~/services/streams'
import { truncateStreamName } from '~/shared/utils/text'
import { createSponsorship } from '~/services/sponsorships'
import TransactionListToast, { Operation } from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'

const FormDataValidator = z
    .object({
        streamId: z.string().trim().min(1),
        initialAmount: z
            .string()
            .refine((value) => toBN(value).isGreaterThanOrEqualTo(0)),
        payoutRate: z.string().refine((value) => toBN(value).isGreaterThan(0)),
        minStakeDuration: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value)),
        minNumberOfOperators: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value)),
        maxNumberOfOperators: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value))
            .optional(),
    })
    .refine(
        ({ minNumberOfOperators, maxNumberOfOperators }) => {
            if (typeof maxNumberOfOperators === 'undefined') {
                return true
            }
            return maxNumberOfOperators >= minNumberOfOperators
        },
        {
            message: 'invalid range of operator numbers',
            path: ['maxNumberOfOperators'],
        },
    )
type FormData = z.infer<typeof FormDataValidator>

const defaultFormData: FormData = {
    streamId: '',
    initialAmount: '',
    payoutRate: '',
    minStakeDuration: 14,
    minNumberOfOperators: 1,
    maxNumberOfOperators: undefined,
}

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (formData: FormData) => void
    balance: string
    formData?: Partial<FormData>
    tokenSymbol: string
    tokenDecimals: number
    streamId?: string
}

export default function CreateSponsorshipModal({
    title = 'Create Sponsorship',
    submitLabel = 'Create',
    onResolve,
    balance: balanceProp = '0',
    formData: formDataProp = {},
    tokenSymbol,
    tokenDecimals,
    streamId: streamIdProp,
    ...props
}: Props) {
    const toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )

    const [busy, setBusy] = useState(false)

    const [streamSearchValue, setStreamSearchValue] = useState('')

    const decimalMultiplier = useMemo(() => Math.pow(10, tokenDecimals), [tokenDecimals])

    const balance = toBN(balanceProp).multipliedBy(decimalMultiplier)

    const [formData, setRawProperties] = useReducer<
        (state: FormData, change: Partial<FormData>) => FormData
    >(
        (state, change) => ({
            ...state,
            ...change,
        }),
        defaultFormData,
    )

    const {
        initialAmount,
        streamId,
        payoutRate,
        minStakeDuration,
        minNumberOfOperators,
        maxNumberOfOperators,
    } = formData

    const initialAmountBN = toBN(initialAmount || '0').multipliedBy(decimalMultiplier)
    const payoutRateBN = toBN(payoutRate || '0').multipliedBy(decimalMultiplier)

    const backdropDismissable =
        streamId === defaultFormData.streamId &&
        toBN(initialAmount || '0').toString() ===
            toBN(defaultFormData.initialAmount || '0').toString() &&
        toBN(payoutRate || '0').toString() ===
            toBN(defaultFormData.payoutRate || '0').toString() &&
        minStakeDuration === defaultFormData.minStakeDuration &&
        minNumberOfOperators === defaultFormData.minNumberOfOperators &&
        maxNumberOfOperators === defaultFormData.maxNumberOfOperators

    const extensionInDays =
        payoutRateBN.isGreaterThan(0) && initialAmountBN.isGreaterThanOrEqualTo(0)
            ? initialAmountBN.dividedBy(payoutRateBN).toNumber()
            : 0

    const insufficientFunds = initialAmountBN.isGreaterThan(balance)

    const invalidOperatorNumberRange =
        typeof formData.maxNumberOfOperators !== 'undefined' &&
        formData.minNumberOfOperators > formData.maxNumberOfOperators

    const canSubmit = FormDataValidator.safeParse(formData).success && !insufficientFunds

    const handleSearchInputChange = async (searchInputValue: string) => {
        const exists = await checkIfStreamExists(searchInputValue)
        if (exists) {
            setRawProperties({
                streamId: searchInputValue,
            })
        } else {
            setStreamSearchValue(searchInputValue)
        }
    }

    useEffect(() => {
        if (!streamIdProp) {
            return void 0
        }
        checkIfStreamExists(streamIdProp).then((exists) => {
            if (exists) {
                setRawProperties({
                    streamId: streamIdProp,
                })
                setStreamSearchValue(streamIdProp)
            }
        })
    }, [streamIdProp])

    const streamsQuery = useInfiniteQuery({
        queryKey: ['createSponsorshipsStreamSearch', streamSearchValue],
        queryFn: async (ctx) => {
            const result: TheGraphStreamResult = await getPagedStreams(
                20,
                ctx.pageParam,
                undefined,
                streamSearchValue,
                TheGraphOrderBy.Id,
                TheGraphOrderDirection.Asc,
            )

            return result
        },
        getNextPageParam: (lastPage) => {
            const theGraphResult = lastPage as TheGraphStreamResult
            if (theGraphResult.lastId) {
                return theGraphResult.hasNextPage ? theGraphResult.lastId : null
            }
            return null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (backdropDismissable || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                const deploymentOperation: Operation = {
                    id: uniqueId('sponsorship-deployment-'),
                    label: 'Sponsorship deployment',
                    state: 'ongoing',
                }

                const operations = [deploymentOperation]
                setTimeout(async () => {
                    await toast.pop({ operations })
                })

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    await createSponsorship({
                        minOperatorCount: Number(formData.minNumberOfOperators),
                        maxOperatorCount: formData.maxNumberOfOperators
                            ? Number(formData.maxNumberOfOperators)
                            : undefined,
                        minimumStakeTime: toBN(formData.minStakeDuration).multipliedBy(
                            86400,
                        ),
                        payoutRate: toBN(formData.payoutRate)
                            .dividedBy(86400)
                            .multipliedBy(decimalMultiplier),
                        initialFunding: toBN(formData.initialAmount).multipliedBy(
                            decimalMultiplier,
                        ),
                        streamId: formData.streamId,
                        metadata: {},
                    })
                    deploymentOperation.state = 'complete'

                    onResolve?.(formData)
                } catch (e) {
                    deploymentOperation.state = 'error'
                    console.warn('Error while creating a Sponsorship', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <Group>
                <GroupHeadline>Select a Stream</GroupHeadline>
                <SectionHeadline>
                    Your Sponsorship will incentivize nodes to relay and secure this
                    stream
                </SectionHeadline>
                <Section>
                    <Label>Select a Stream</Label>
                    <SearchDropdown
                        name="streamId"
                        onSelect={(streamId) => {
                            setRawProperties({
                                streamId,
                            })
                        }}
                        onSearchInputChange={handleSearchInputChange}
                        options={
                            streamsQuery.data?.pages
                                .flatMap((d) => d.streams)
                                .map((stream) => ({
                                    label: truncateStreamName(stream.id),
                                    value: stream.id,
                                })) ?? []
                        }
                        isLoadingOptions={
                            streamsQuery.isLoading || streamsQuery.isFetching
                        }
                        placeholder="Type to select a stream"
                        readOnly={busy}
                        value={streamId}
                    />
                </Section>
            </Group>
            <Group>
                <GroupHeadline>Set Sponsorship parameters</GroupHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label>Initial amount to fund</Label>
                        {insufficientFunds && <ErrorLabel>Insufficient funds</ErrorLabel>}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={insufficientFunds}>
                        <TextInput
                            name="initialAmount"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    initialAmount: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof initialAmount !== 'undefined' ? initialAmount : ''
                            }
                        />
                        <TextAppendix>{tokenSymbol}</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            Wallet balance:{' '}
                            <strong>
                                {balance.dividedBy(decimalMultiplier).toString()}{' '}
                                {tokenSymbol}
                            </strong>
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <Label>Payout rate*</Label>
                    <FieldWrap>
                        <TextInput
                            name="payoutRate"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    payoutRate: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={typeof payoutRate !== 'undefined' ? payoutRate : ''}
                        />
                        <TextAppendix>{tokenSymbol}/day</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            The Sponsorship will be funded for{' '}
                            {extensionInDays.toFixed(2).replace(/\.00$/, '')} days
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <Label>Minimum time operators must stay staked</Label>
                    <FieldWrap>
                        <TextInput
                            name="minStakeDuration"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minStakeDuration: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof minStakeDuration !== 'undefined'
                                    ? minStakeDuration
                                    : ''
                            }
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Minimum number of operators to start payout</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="minNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minNumberOfOperators: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof minNumberOfOperators !== 'undefined'
                                    ? minNumberOfOperators
                                    : ''
                            }
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Maximum number of operators</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="maxNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    maxNumberOfOperators: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="Leave blank if you don't want to set a limit"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof maxNumberOfOperators !== 'undefined'
                                    ? maxNumberOfOperators
                                    : ''
                            }
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
            </Group>
        </FormModal>
    )
}
