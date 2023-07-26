import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'
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

interface RawFormData {
    streamId: string
    initialAmount: string
    payoutRate: string
    minStakeDuration: string
    minNumberOfOperators: string
    maxNumberOfOperators: string
}

const FormData = z
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
            .refine((value) => Number.isSafeInteger(value)),
    })
    .refine(
        ({ minNumberOfOperators, maxNumberOfOperators }) =>
            maxNumberOfOperators === 0 || maxNumberOfOperators >= minNumberOfOperators,
        {
            message: 'invalid range of operator numbers',
        },
    )

type FormData = z.infer<typeof FormData>

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (formData: FormData) => void
    balance: string
    formData?: Partial<FormData>
    tokenSymbol: string
    tokenDecimals: number
    streamId?: string
}

function getRawFormData(
    formData: Partial<FormData>,
    decimalMultiplier: number,
): RawFormData {
    return {
        initialAmount: !formData.initialAmount
            ? ''
            : toBN(formData.initialAmount).dividedBy(decimalMultiplier).toString(),
        streamId: formData.streamId || '',
        payoutRate: !formData.payoutRate
            ? ''
            : toBN(formData.payoutRate).dividedBy(decimalMultiplier).toString(),
        minStakeDuration:
            typeof formData.minStakeDuration === 'undefined'
                ? ''
                : `${formData.minStakeDuration}`,
        minNumberOfOperators:
            typeof formData.minNumberOfOperators === 'undefined'
                ? ''
                : `${formData.minNumberOfOperators}`,
        maxNumberOfOperators:
            typeof formData.maxNumberOfOperators === 'undefined'
                ? ''
                : `${formData.maxNumberOfOperators}`,
    }
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
    const [busy, setBusy] = useState(false)

    const [streamSearchValue, setStreamSearchValue] = useState('')

    const decimalMultiplier = useMemo(() => Math.pow(10, tokenDecimals), [tokenDecimals])

    const balance = toBN(balanceProp).multipliedBy(decimalMultiplier)

    const initialRawFormData = getRawFormData(formDataProp, decimalMultiplier)

    const [
        {
            initialAmount: rawInitialAmount,
            streamId: rawStreamId,
            payoutRate: rawPayoutRate,
            minStakeDuration: rawMinStakeDuration,
            minNumberOfOperators: rawMinNumberOfOperators,
            maxNumberOfOperators: rawMaxNumberOfOperators,
        },
        setRawProperties,
    ] = useReducer<(state: RawFormData, change: Partial<RawFormData>) => RawFormData>(
        (state, change) => ({
            ...state,
            ...change,
        }),
        initialRawFormData,
    )

    const initialAmountBN = toBN(rawInitialAmount || '0').multipliedBy(decimalMultiplier)

    const initialAmount = initialAmountBN.toString()

    const payoutRateBN = toBN(rawPayoutRate || '0').multipliedBy(decimalMultiplier)

    const payoutRate = payoutRateBN.toString()

    const minStakeDuration = rawMinStakeDuration || '0'

    const minNumberOfOperators = rawMinNumberOfOperators || '0'

    const maxNumberOfOperators = rawMaxNumberOfOperators || '0'

    const streamId = rawStreamId

    const formData: FormData = {
        streamId,
        initialAmount,
        payoutRate,
        minStakeDuration: Number.parseInt(minStakeDuration),
        minNumberOfOperators: Number.parseInt(minNumberOfOperators),
        maxNumberOfOperators: Number.parseInt(maxNumberOfOperators),
    }

    const backdropDismissable =
        rawStreamId === initialRawFormData.streamId &&
        toBN(rawInitialAmount || '0').toString() ===
            toBN(initialRawFormData.initialAmount || '0').toString() &&
        toBN(rawPayoutRate || '0').toString() ===
            toBN(initialRawFormData.payoutRate || '0').toString() &&
        minStakeDuration === (initialRawFormData.minStakeDuration || '0') &&
        minNumberOfOperators === (initialRawFormData.minNumberOfOperators || '0') &&
        maxNumberOfOperators === (initialRawFormData.maxNumberOfOperators || '0')

    const extensionInDays =
        payoutRateBN.isGreaterThan(0) && initialAmountBN.isGreaterThanOrEqualTo(0)
            ? initialAmountBN.dividedBy(payoutRateBN).toNumber()
            : 0

    const insufficientFunds = initialAmountBN.isGreaterThan(balance)

    const invalidOperatorNumberRange =
        formData.maxNumberOfOperators !== 0 &&
        formData.minNumberOfOperators > formData.maxNumberOfOperators

    const canSubmit = FormData.safeParse(formData).success && !insufficientFunds

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

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    console.log('formData', formData)
                    await createSponsorship({
                        initialMinHorizonSeconds: toBN(formData.minStakeDuration)
                            .multipliedBy(86400)
                            .toNumber(),
                        initialMinimumStakeWei: Number(formData.initialAmount),
                        initialMinOperatorCount: Number(formData.minNumberOfOperators),
                        streamId: formData.streamId,
                        metadata: {},
                        policies: [],
                        initParams: [],
                    })

                    onResolve?.(formData)
                } catch (e) {
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
                            value={rawInitialAmount}
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
                            value={rawPayoutRate}
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
                    <Label>Minimum time Operators must stay staked</Label>
                    <FieldWrap>
                        <TextInput
                            name="minStakeDuration"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minStakeDuration: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinStakeDuration}
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Minimum number of Operators</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="minNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minNumberOfOperators: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinNumberOfOperators}
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Maximum number of Operators</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="maxNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    maxNumberOfOperators: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMaxNumberOfOperators}
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
            </Group>
        </FormModal>
    )
}
