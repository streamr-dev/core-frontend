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
import Help from '~/components/Help'
import AvatarImage from '~/shared/components/AvatarImage'
import { COLORS } from '~/shared/utils/styled'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import { Layer } from '~/utils/Layer'
import { Alert } from '~/components/Alert'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { sameBN } from '~/utils'
import { createOperator, updateOperator } from '~/services/operators'
import { blockObserver } from '~/utils/blocks'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getParsedOperatorByOwnerAddress } from '~/getters'

interface Props extends Pick<FormModalProps, 'onReject'> {
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

function OperatorModal({ onResolve, onReject, operator, ...props }: Props) {
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

    const canBackdropDismiss = !busy && !dirty

    const readonlyCut = !!operator && operator.stakes.length > 0

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                reason !== RejectionReason.Backdrop || canBackdropDismiss
            }
            onReject={onReject}
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                function onBlockNumber(blockNumber: number) {
                    return new Promise<void>((resolve) => {
                        blockObserver.onSpecific(blockNumber, resolve)
                    })
                }

                try {
                    if (!operator) {
                        await createOperator(finalData, { onBlockNumber })
                    } else {
                        await updateOperator(operator, finalData, { onBlockNumber })
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
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please choose the percentage for the Owner&apos;s cut{' '}
                <Help align="center">
                    <p>
                        The Owner&apos;s cut percentage is the earnings split between the
                        Operator and its Delegators. This value can be updated as long as
                        the Operator is not staked on any&nbsp;Sponsorships.
                    </p>
                </Help>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label>
                        <LabelInner>
                            <span>Owner&apos;s cut percentage*</span>
                        </LabelInner>
                    </Label>
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
                <Help align="center">
                    <p>
                        Sets the amount of duplicated work when running a fleet of
                        multiple nodes. Doing redundant work protects against slashing in
                        case some of your nodes experience failures. For example, setting
                        this to 1 means that no duplication of work occurs (the feature is
                        off), and setting it to 2 means that each stream assignment will
                        be worked on by 2 nodes in your fleet.
                    </p>
                </Help>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label>
                        <LabelInner>
                            <span>Node redundancy factor*</span>
                        </LabelInner>
                    </Label>
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
                        <Label>
                            <LabelInner>
                                <span>Display name*</span>
                            </LabelInner>
                        </Label>
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
                            <Label>
                                <LabelInner>
                                    <span>Description</span>
                                </LabelInner>
                            </Label>
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
                        <Label>
                            <LabelInner>
                                <span>Operator Avatar</span>
                            </LabelInner>
                        </Label>
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

const LabelInner = styled.div`
    align-items: center;
    display: flex;
`

const AboutOperator = styled.div`
    margin-top: 40px;
`

const AboutOperatorField = styled.div`
    margin-top: 16px;
`

const AvatarField = styled.div`
    display: flex;
    padding: 20px;
`

const AvatarDisplayContainer = styled.div`
    margin-right: 30px;
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
    padding: 0;
    margin: 10px 0 0;
    list-style-position: inside;
`

const ButtonIcon = styled(SvgIcon)`
    width: 12px;
    height: 12px;
    margin-right: 8px;
`

const AlertContainer = styled.div`
    margin-top: 10px;
`
