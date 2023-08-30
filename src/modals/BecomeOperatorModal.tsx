import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { randomHex } from 'web3-utils'
import { toaster } from 'toasterhea'
import styled, { css } from 'styled-components'
import { RejectionReason } from '~/modals/BaseModal'
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

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (
        cut: number,
        name: string,
        redundancyFactor: number,
        description?: string,
        imageToUpload?: File,
    ) => void
    onSubmit: (
        cut: number,
        name: string,
        redundancyFactor: number,
        description?: string,
        imageToUpload?: File,
    ) => Promise<void>
    cut?: number
    name?: string
    description?: string
    imageUrl?: string
}

const cropModal = toaster(CropImageModal, Layer.Modal)

export default function BecomeOperatorModal({
    title = 'Become an Operator',
    submitLabel = 'Become an Operator',
    onResolve,
    onSubmit,
    cut: cutProp,
    name: nameProp,
    description: descriptionProp,
    imageUrl: imageUrlProp,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const [cutValue, setCutValue] = useState<string | undefined>(cutProp?.toString())
    const [name, setName] = useState<string | undefined>()
    const [description, setDescription] = useState<string | undefined>()
    const [imageToUpload, setImageToUpload] = useState<File>()
    const [redundancyFactor, setRedundancyFactor] = useState<string>('2')

    const cutValueNumeric = Number(cutValue || undefined) // so that it will be a NaN if it's empty string

    useEffect(() => {
        setCutValue(cutProp?.toString())
    }, [cutProp])

    const cutValueIsValid = useMemo<boolean>(
        () => !isNaN(cutValueNumeric) && cutValueNumeric >= 0 && cutValueNumeric <= 100,
        [cutValueNumeric],
    )

    const cutValueIsTouchedAndInvalid = useMemo<boolean>(
        () => typeof cutValue !== 'undefined' && !cutValueIsValid,
        [cutValue, cutValueIsValid],
    )

    const nameIsValid = useMemo(() => !!name, [name])

    const nameIsTouchedAndInvalid = useMemo(() => name === '', [name])

    const descriptionLengthLimit = 120

    const descriptionTooLong = (description?.length || 0) > 120

    const redundancyFactorNumber = Number(redundancyFactor)

    const redundancyFactorIsValid =
        !isNaN(redundancyFactorNumber) && redundancyFactorNumber >= 1

    const randomAddress = useMemo<string>(() => randomHex(20), [])

    const fileInputRef = useRef<HTMLInputElement>()

    const handleCrop = useCallback(
        async (image: File) => {
            try {
                setImageToUpload(
                    await cropModal.pop({
                        imageUrl: URL.createObjectURL(image),
                        mask: 'round',
                    }),
                )
            } catch (e) {
                // action cancelled
            }
        },
        [setImageToUpload],
    )

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={
                cutValueIsValid &&
                nameIsValid &&
                !descriptionTooLong &&
                redundancyFactorIsValid &&
                !busy
            }
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (cutValue === cutProp || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    await onSubmit(
                        cutValueNumeric,
                        name as string,
                        Number(redundancyFactor),
                        description,
                        imageToUpload,
                    )
                    onResolve?.(
                        cutValueNumeric,
                        name as string,
                        Number(redundancyFactor),
                        description,
                        imageToUpload,
                    )
                } catch (e) {
                    console.warn('Error while becoming an operator', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <SectionHeadline>
                Please choose the percentage for the Operator&apos;s cut{' '}
                <Help align="center">
                    <p>
                        The cut taken by the Operator from all earnings. This percentage
                        can not be changed later. The rest is shared among Delegators
                        including the Operator&apos;s own&nbsp;stake.
                    </p>
                </Help>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label>
                        <LabelInner>
                            <span>Operator&apos;s cut percentage*</span>
                        </LabelInner>
                    </Label>
                    {cutValueIsTouchedAndInvalid && (
                        <ErrorLabel>Value must be between 0 and 100</ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={cutValueIsTouchedAndInvalid}>
                    <TextInput
                        name="cut"
                        autoFocus
                        onChange={({ target }) =>
                            void setCutValue(
                                target.value ? Number(target.value).toString() : '',
                            )
                        }
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        max={100}
                        value={typeof cutValue !== 'undefined' ? cutValue : ''}
                    />
                    <TextAppendix>%</TextAppendix>
                </FieldWrap>
            </Section>
            <SectionHeadline>
                Please choose the redundancy factor{' '}
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
                            <span>Redundancy factor*</span>
                        </LabelInner>
                    </Label>
                    {!redundancyFactorIsValid && (
                        <ErrorLabel>Value must be greater or equal to 1</ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={!redundancyFactorIsValid}>
                    <TextInput
                        name="redundancyFactor"
                        onChange={({ target }) => void setRedundancyFactor(target.value)}
                        placeholder="2"
                        readOnly={busy}
                        type="number"
                        min={1}
                        max={100}
                        value={
                            typeof redundancyFactor !== 'undefined'
                                ? redundancyFactor
                                : ''
                        }
                    />
                </FieldWrap>
            </Section>
            <AboutOperator>
                <SectionHeadline>About operator</SectionHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label>
                            <LabelInner>
                                <span>Display name*</span>
                            </LabelInner>
                        </Label>
                        {nameIsTouchedAndInvalid && (
                            <ErrorLabel>Name is required</ErrorLabel>
                        )}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={nameIsTouchedAndInvalid}>
                        <TextInput
                            name="name"
                            onChange={({ target }) => setName(target.value)}
                            readOnly={busy}
                            type="text"
                            value={name || ''}
                            placeholder={'Name'}
                        />
                    </FieldWrap>

                    <AboutOperatorField>
                        <WingedLabelWrap>
                            <Label>
                                <LabelInner>
                                    <span>Description</span>
                                </LabelInner>
                            </Label>
                            {descriptionTooLong && (
                                <ErrorLabel>Description is too long</ErrorLabel>
                            )}
                        </WingedLabelWrap>
                        <FieldWrap $invalid={descriptionTooLong}>
                            <TextareaInput
                                name="description"
                                onChange={({ target }) => setDescription(target.value)}
                                readOnly={busy}
                                value={description || ''}
                                placeholder={'Description'}
                                $minHeight={110}
                            />
                            <TextareaCounter $invalid={descriptionTooLong}>
                                {description?.length || 0}/{descriptionLengthLimit}
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
                                    {!imageUrlProp && !imageToUpload && (
                                        <AvatarPlaceholder username={randomAddress} />
                                    )}
                                    {(imageUrlProp || imageToUpload) && (
                                        <OperatorAvatar
                                            src={
                                                imageToUpload
                                                    ? URL.createObjectURL(imageToUpload)
                                                    : imageUrlProp
                                            }
                                        />
                                    )}
                                </AvatarDisplayContainer>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        onChange={() => {
                                            if (fileInputRef.current?.files?.length) {
                                                handleCrop(fileInputRef.current.files[0])
                                            }
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
