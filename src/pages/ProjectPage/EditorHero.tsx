import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import {
    PropertyDropdown,
    PropertyDropdownList,
    PropertyIcon,
} from '~/components/PropertyDropdown'
import RichTextEditor from '~/components/RichTextEditor'
import { getBase64ForFile } from '~/getters'
import { getEmptyParsedProject } from '~/parsers/ProjectParser'
import { ProjectType } from '~/shared/types'
import { COLORS } from '~/shared/utils/styled'
import { ProjectDraft, usePersistProjectCallback } from '~/stores/projectDraft'
import { OpenDataPayload } from '~/types/projects'
import { Layer } from '~/utils/Layer'
import CoverImage, { Root as CoverImageRoot, Wide } from './CoverImage'

const cropModal = toaster(CropImageModal, Layer.Modal)

export default function EditorHero() {
    const { creator, contact, name, description, imageUrl } =
        ProjectDraft.useEntity({ hot: true }) ||
        getEmptyParsedProject({
            type: ProjectType.OpenData,
        })

    const [newImageUrl, setNewImageUrl] = useState<string>()

    const update = ProjectDraft.useUpdateEntity()

    const errors = ProjectDraft.useDraft()?.errors || {}

    const setErrors = ProjectDraft.useSetDraftErrors()

    const busy = ProjectDraft.useIsDraftBusy()

    const imageAbortControllerRef = useRef<AbortController>()

    useEffect(() => {
        const { current: abortController } = imageAbortControllerRef

        return () => {
            abortController?.abort()
        }
    }, [])

    const persist = usePersistProjectCallback()

    function validate(fn: () => void) {
        try {
            fn()
        } catch (e) {
            if (e instanceof z.ZodError) {
                const errors = {}

                e.issues.forEach(({ path, message }) => {
                    errors[path.join('.')] = message
                })

                setErrors((existingErrors) => {
                    Object.assign(existingErrors, errors)
                })
            }

            throw e
        }
    }

    return (
        <HeroContainer>
            <ImageWrap>
                <NameInput
                    disabled={busy}
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => {
                        update((project) => {
                            project.name = e.target.value
                        })
                    }}
                    onKeyDown={({ key }) => {
                        if (key === 'Enter') {
                            persist()
                        }
                    }}
                />
                <CoverImage
                    disabled={busy}
                    src={newImageUrl || imageUrl}
                    onChange={async (file) => {
                        imageAbortControllerRef.current?.abort()

                        const abortController = new AbortController()

                        imageAbortControllerRef.current = abortController

                        const { signal } = abortController

                        const croppedFile = await cropModal.pop({
                            imageUrl: URL.createObjectURL(file),
                        })

                        if (signal.aborted) {
                            return
                        }

                        update((draft) => {
                            draft.newImageToUpload = croppedFile
                        })

                        const url = await getBase64ForFile(croppedFile)

                        if (signal.aborted) {
                            return
                        }

                        setNewImageUrl(url)
                    }}
                />
            </ImageWrap>
            <DetailsWrap>
                <NameInput
                    disabled={busy}
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => {
                        update((project) => {
                            project.name = e.target.value
                        })
                    }}
                    onKeyDown={({ key }) => {
                        if (key === 'Enter') {
                            persist()
                        }
                    }}
                />
                <Desc>
                    <RichTextEditor
                        readOnly={busy}
                        placeholder="Type something great about your project…"
                        defaultValue={description}
                        onChange={(newDescription) => {
                            update((project) => {
                                project.description = newDescription
                            })
                        }}
                    />
                </Desc>
                <PropertyDropdownList>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors.creator}
                            onDismiss={() => {
                                setErrors((errors) => {
                                    delete errors.creator
                                })
                            }}
                            onSubmit={(value) => {
                                setErrors((errors) => {
                                    delete errors.creator
                                })

                                validate(() => {
                                    OpenDataPayload.pick({
                                        creator: true,
                                    }).parse({
                                        creator: value,
                                    })
                                })

                                update((project) => {
                                    project.creator = value
                                })
                            }}
                            required
                            submitLabel="Add creator's name"
                            title="Please provide your name"
                            toggleIcon={<PropertyIcon name="userFull" />}
                            value={creator}
                            valuePlaceholder="Creator's name"
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.url']}
                            onDismiss={() => {
                                setErrors((errors) => {
                                    delete errors['contact.url']
                                })
                            }}
                            onSubmit={(value) => {
                                setErrors((errors) => {
                                    delete errors['contact.url']
                                })

                                validate(() => {
                                    OpenDataPayload.pick({
                                        contact: true,
                                    }).parse({
                                        contact: {
                                            url: value,
                                        },
                                    })
                                })

                                update((project) => {
                                    project.contact.url = value
                                })
                            }}
                            submitLabel="Add site URL"
                            title="Please add a site URL"
                            toggleIcon={<PropertyIcon name="web" />}
                            value={contact.url}
                            valuePlaceholder="Site URL"
                            placeholder="https://siteinfo.com"
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.email']}
                            onSubmit={(value) => {
                                update((project) => {
                                    project.contact.email = value
                                })
                            }}
                            submitLabel="Add contact email"
                            title="Please add a contact email"
                            toggleIcon={<PropertyIcon name="email" />}
                            value={contact.email}
                            valuePlaceholder="Contact email"
                            placeholder="owner@example.com"
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.twitter']}
                            onSubmit={(value) => {
                                update((project) => {
                                    project.contact.twitter = value
                                })
                            }}
                            submitLabel="Add Twitter link"
                            title="Please add Twitter link"
                            toggleIcon={
                                <PropertyIcon
                                    name="twitter"
                                    $color={contact.twitter ? '#1da1f2' : undefined}
                                />
                            }
                            value={contact.twitter}
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.telegram']}
                            onSubmit={(value) => {
                                update((project) => {
                                    project.contact.telegram = value
                                })
                            }}
                            submitLabel="Add Telegram link"
                            title="Please add Telegram link"
                            toggleIcon={
                                <PropertyIcon
                                    name="telegram"
                                    $color={contact.telegram ? '#2aabee' : void 0}
                                />
                            }
                            value={contact.telegram}
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.reddit']}
                            onSubmit={(value) => {
                                update((project) => {
                                    project.contact.reddit = value
                                })
                            }}
                            submitLabel="Add Reddit link"
                            title="Please add Reddit link"
                            toggleIcon={
                                <PropertyIcon
                                    name="reddit"
                                    $color={contact.reddit ? '#ff5700' : void 0}
                                />
                            }
                            value={contact.reddit}
                        />
                    </li>
                    <li>
                        <PropertyDropdown
                            disabled={busy}
                            error={errors['contact.linkedIn']}
                            onSubmit={(value) => {
                                update((project) => {
                                    project.contact.linkedIn = value
                                })
                            }}
                            submitLabel="Add LinkedIn link"
                            title="Please add LinkedIn link"
                            toggleIcon={
                                <PropertyIcon
                                    name="linkedin"
                                    $color={contact.linkedIn ? '#0077b5' : void 0}
                                />
                            }
                            value={contact.linkedIn}
                        />
                    </li>
                </PropertyDropdownList>
            </DetailsWrap>
        </HeroContainer>
    )
}

const NameInput = styled.input`
    border: 0 !important;
    display: block;
    font-size: 34px;
    line-height: 44px;
    margin: 0 0 24px;
    outline: 0 !important;
    padding: 0;
    width: 100%;

    ::placeholder {
        color: ${COLORS.primaryDisabled};
    }

    :disabled {
        background: none;
    }

    @media (min-width: ${Wide}px) {
        margin-top: 10px;
    }
`

const ImageWrap = styled.div`
    @media (min-width: ${Wide}px) {
        ${NameInput} {
            display: none;
        }
    }
`

const DetailsWrap = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;

    ${NameInput} {
        display: none;
    }

    @media (min-width: ${Wide}px) {
        ${NameInput} {
            display: block;
        }
    }
`

const Desc = styled.div`
    flex-grow: 1;
    margin: 32px 0;

    @media (min-width: ${Wide}px) {
        margin: 0 0 48px;
    }
`

const HeroContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    padding: 24px;

    @media (min-width: ${Wide}px) {
        display: flex;
        padding: 40px;

        ${CoverImageRoot} {
            flex-shrink: 0;
            margin-right: 40px;
        }
    }
`
