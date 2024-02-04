import React, { useEffect, useMemo, useRef, useState } from 'react'
import { randomHex } from 'web3-utils'
import { toaster } from 'toasterhea'
import styled, { css } from 'styled-components'
import { ZodError, z } from 'zod'
import { RejectionReason, isRejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    Section,
    SectionHeadline,
    TextAppendix,
    TextareaCounter,
    TextareaInput,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import AvatarImage from '~/shared/components/AvatarImage'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { Button } from '~/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import { Layer } from '~/utils/Layer'
import { Alert } from '~/components/Alert'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { isTransactionRejection, sameBN, waitForIndexedBlock } from '~/utils'
import { createOperator, updateOperator } from '~/services/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getParsedOperatorByOwnerAddress } from '~/getters'
import { Hint } from '~/components/Hint'

interface Props extends Pick<FormModalProps, 'onReject'> {
    chainId: number
    onResolve?: (operatorId: string) => void
    operator: ParsedOperator | undefined
}

const cropModal = toaster(CropImageModal, Layer.Modal)

const DescriptionLengthLimit = 120

interface Form {
    cut: string
    description: string
    imageToUpload: File | undefined
    name: string
    redundancyFactor: string
}

function isFormKey(value: unknown): value is keyof Form {
    return (
        value === 'cut' ||
        value === 'description' ||
        value === 'imageToUpload' ||
        value === 'name' ||
        value === 'redundancyFactor'
    )
}

const Validator = z.object({
    cut: z.coerce
        .number()
        .min(0, 'Value must be between 0 and 100')
        .max(100, 'Value must be between 0 and 100'),
    description: z.string().max(DescriptionLengthLimit, 'Description is too long'),
    imageToUpload: z.instanceof(File).optional(),
    name: z.string().trim().min(1, 'Name is required'),
    redundancyFactor: z.coerce.number().min(1, 'Value must be greater or equal to 1'),
})

function OperatorModal({ onResolve, onReject, operator, chainId, ...props }: Props) {
    const [title, submitLabel] = operator
        ? ['Edit Operator', 'Save']
        : ['Become an Operator', 'Become an Operator']

    const [busy, setBusy] = useState(false)

    const currentData: Form = useMemo(
        () => ({
            cut: operator?.operatorsCut.toString() || '',
            description: operator?.metadata.description || '',
            imageToUpload: undefined,
            name: operator?.metadata.name || '',
            redundancyFactor: operator?.metadata.redundancyFactor?.toString() || '2',
        }),
        [operator],
    )

    const [nextData, updateNextData] = useState<Form>(currentData)

    useEffect(() => {
        /**
         * Handle an update coming from the outside. It won't happen often
         * but it can happen.
         */
        updateNextData(currentData)
    }, [currentData])

    const changelog: Record<keyof Form, boolean> = {
        imageToUpload: !!nextData.imageToUpload,
        name: currentData.name !== nextData.name,
        description: currentData.description !== nextData.description,
        redundancyFactor: !sameBN(
            currentData.redundancyFactor || 0,
            nextData.redundancyFactor || 0,
        ),
        cut: !sameBN(currentData.cut || 0, nextData.cut || 0),
    }

    const dirty = Object.values(changelog).some(Boolean)

    const randomAddress = useMemo<string>(() => randomHex(20), [])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const imageBlob =
        (nextData.imageToUpload && URL.createObjectURL(nextData.imageToUpload)) ||
        operator?.metadata.imageUrl

    const [finalData, errors]:
        | [ReturnType<typeof Validator.parse>, null]
        | [null, Partial<Record<keyof Form, string>>] = (() => {
        try {
            return [Validator.parse(nextData), null]
        } catch (e) {
            if (!(e instanceof ZodError)) {
                throw e
            }

            const result: Partial<Record<keyof Form, string>> = {}

            e.issues.forEach(({ path: [key], message }) => {
                if (!isFormKey(key)) {
                    return void console.warn('Unresolved form issue', key, message)
                }

                if (!changelog[key]) {
                    /**
                     * Ignore fields that did not change.
                     */
                    return
                }

                if (!result[key]) {
                    result[key] = message
                }
            })

            return [null, result]
        }
    })()

    const walletAddress = useWalletAccount()

    const canSubmit = !busy && !!finalData && dirty && !!walletAddress

    const readonlyCut = !!operator && operator.stakes.length > 0

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (reason !== RejectionReason.Backdrop || !dirty)
            }
            onReject={onReject}
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    if (!operator) {
                        await createOperator(chainId, finalData, {
                            onBlockNumber: waitForIndexedBlock,
                        })
                    } else {
                        await updateOperator(chainId, operator, finalData, {
                            onBlockNumber: waitForIndexedBlock,
                        })
                    }

                    const operatorId = (
                        await getParsedOperatorByOwnerAddress(walletAddress, {
                            force: true,
                        })
                    )?.id

                    if (!operatorId) {
                        throw new Error('Empty operator id')
                    }

                    onResolve?.(operatorId)
                } catch (e) {
                    if (isRejectionReason(e)) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    throw e
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please choose the percentage for the Owner&apos;s cut{' '}
                <Hint>
                    <p>
                        The Owner&apos;s cut percentage is the earnings split between the
                        Operator and its Delegators. This value can be updated as long as
                        the Operator is not staked on any&nbsp;Sponsorships.
                    </p>
                </Hint>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label $wrap>Owner&apos;s cut percentage*</Label>
                    {errors?.cut && <ErrorLabel>{errors.cut}</ErrorLabel>}
                </WingedLabelWrap>
                <FieldWrap $invalid={!!errors?.cut} $grayedOut={readonlyCut}>
                    <TextInput
                        name="cut"
                        autoFocus={!readonlyCut}
                        onChange={({ target: { value: cut } }) => {
                            updateNextData((c) => ({
                                ...c,
                                cut,
                            }))
                        }}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        max={100}
                        value={nextData.cut}
                        disabled={readonlyCut}
                    />
                    <TextAppendix>%</TextAppendix>
                </FieldWrap>
            </Section>
            {readonlyCut && (
                <AlertContainer>
                    <Alert type="notice" title="Owner's cut locked">
                        <span>
                            The owner&apos;s cut can&apos;t be modified while staked. To
                            change it, fully unstake from all sponsorships.
                        </span>
                    </Alert>
                </AlertContainer>
            )}
            <SectionHeadline>
                Please input your node redundancy factor{' '}
                <Hint>
                    <p>
                        Sets the amount of duplicated work when running a fleet of
                        multiple nodes. Doing redundant work protects against slashing in
                        case some of your nodes experience failures. For example, setting
                        this to 1 means that no duplication of work occurs (the feature is
                        off), and setting it to 2 means that each stream assignment will
                        be worked on by 2 nodes in your fleet.
                    </p>
                </Hint>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label $wrap>Node redundancy factor*</Label>
                    {errors?.redundancyFactor && (
                        <ErrorLabel>{errors.redundancyFactor}</ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={!!errors?.redundancyFactor}>
                    <TextInput
                        name="redundancyFactor"
                        onChange={({ target: { value: redundancyFactor } }) => {
                            updateNextData((c) => ({
                                ...c,
                                redundancyFactor,
                            }))
                        }}
                        placeholder="2"
                        readOnly={busy}
                        type="number"
                        min={1}
                        max={100}
                        step={1}
                        value={nextData.redundancyFactor}
                    />
                </FieldWrap>
            </Section>
            <AboutOperator>
                <SectionHeadline>About Operator</SectionHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label $wrap>Display name*</Label>
                        {errors?.name && <ErrorLabel>{errors.name}</ErrorLabel>}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={!!errors?.name}>
                        <TextInput
                            name="name"
                            onChange={({ target: { value: name } }) => {
                                updateNextData((c) => ({
                                    ...c,
                                    name,
                                }))
                            }}
                            readOnly={busy}
                            type="text"
                            value={nextData.name}
                            placeholder="Name"
                        />
                    </FieldWrap>
                    <AboutOperatorField>
                        <WingedLabelWrap>
                            <Label $wrap>Description</Label>
                            {errors?.description && (
                                <ErrorLabel>Description is too long</ErrorLabel>
                            )}
                        </WingedLabelWrap>
                        <FieldWrap $invalid={!!errors?.description}>
                            <TextareaInput
                                name="description"
                                onChange={({ target: { value: description } }) => {
                                    updateNextData((c) => ({
                                        ...c,
                                        description,
                                    }))
                                }}
                                readOnly={busy}
                                value={nextData.description}
                                placeholder="Description"
                                $minHeight={110}
                            />
                            <TextareaCounter $invalid={!!errors?.description}>
                                {nextData.description.length}/{DescriptionLengthLimit}
                            </TextareaCounter>
                        </FieldWrap>
                    </AboutOperatorField>
                    <AboutOperatorField>
                        <Label $wrap>Operator Avatar</Label>
                        <FieldWrap>
                            <AvatarField>
                                <AvatarDisplayContainer>
                                    {imageBlob ? (
                                        <OperatorAvatar src={imageBlob} />
                                    ) : (
                                        <AvatarPlaceholder username={randomAddress} />
                                    )}
                                </AvatarDisplayContainer>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            void (async () => {
                                                if (!e.target.files?.length) {
                                                    return
                                                }

                                                try {
                                                    const imageToUpload =
                                                        await cropModal.pop({
                                                            imageUrl: URL.createObjectURL(
                                                                e.target.files[0],
                                                            ),
                                                            mask: 'round',
                                                        })

                                                    updateNextData((c) => ({
                                                        ...c,
                                                        imageToUpload,
                                                    }))
                                                } catch (e) {
                                                    if (isRejectionReason(e)) {
                                                        return
                                                    }

                                                    throw e
                                                }
                                            })()
                                        }}
                                    />
                                    <Button
                                        kind="secondary"
                                        size="normal"
                                        type="button"
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                        }}
                                    >
                                        <ButtonIcon name="plus" />
                                        Upload Avatar
                                    </Button>
                                    <AvatarRequirements>
                                        <li>JPEG or PNG format only</li>
                                    </AvatarRequirements>
                                </div>
                            </AvatarField>
                        </FieldWrap>
                    </AboutOperatorField>
                </Section>
            </AboutOperator>
        </FormModal>
    )
}

export const operatorModal = toaster(OperatorModal, Layer.Modal)

const AboutOperator = styled.div`
    margin-top: 40px;
`

const AboutOperatorField = styled.div`
    margin-top: 16px;
`

const AvatarField = styled.div`
    padding: 20px;
    width: 100%;

    button {
        width: 100%;
    }

    @media ${TABLET} {
        display: flex;

        button {
            width: auto;
        }
    }
`

const AvatarDisplayContainer = styled.div`
    margin: 0 auto 16px;
    width: max-content;

    @media ${TABLET} {
        margin: 0 32px 0 0;
    }
`

const AvatarImageStyles = css`
    width: 80px;
    height: 80px;
    border: 1px solid ${COLORS.secondaryHover};
    border-radius: 100%;
`

const AvatarPlaceholder = styled(AvatarImage)`
    ${AvatarImageStyles}
`

const OperatorAvatar = styled.img`
    ${AvatarImageStyles}
`

const AvatarRequirements = styled.ul`
    color: #555;
    font-size: 12px;
    list-style-position: inside;
    margin: 10px 0 0;
    padding: 0;
    text-align: center;
`

const ButtonIcon = styled(SvgIcon)`
    width: 12px;
    height: 12px;
    margin-right: 8px;
`

const AlertContainer = styled.div`
    margin-top: 10px;
`
