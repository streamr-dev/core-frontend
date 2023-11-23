import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import {
    useDraft,
    useIsProjectBusy,
    usePersistCurrentProjectDraft,
    useProject,
    useSetProjectErrors,
    useUpdateProject,
} from '~/shared/stores/projectEditor'
import { COLORS } from '~/shared/utils/styled'
import RichTextEditor from '~/components/RichTextEditor'
import DetailDropdown, {
    DetailIcon,
    List as DetailDropdownList,
} from '~/components/DetailDropdown'
import ProjectProperty from '~/components/ProjectProperty'
import { getBase64ForFile } from '~/getters'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import { Layer } from '~/utils/Layer'
import { OpenDataPayload } from '~/types/projects'
import CoverImage, { Wide, Root as CoverImageRoot } from './CoverImage'

const cropModal = toaster(CropImageModal, Layer.Modal)

export default function EditorHero() {
    const { creator, contact, name, description, imageUrl } = useProject({ hot: true })

    const [newImageUrl, setNewImageUrl] = useState<string>()

    const update = useUpdateProject()

    const errors = useDraft()?.errors || {}

    const setErrors = useSetProjectErrors()

    const busy = useIsProjectBusy()

    const imageAbortControllerRef = useRef<AbortController>()

    useEffect(() => {
        const { current: abortController } = imageAbortControllerRef

        return () => {
            abortController?.abort()
        }
    }, [])

    const persist = usePersistCurrentProjectDraft()

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
                <DetailDropdownList>
                    <li>
                        <DetailDropdown
                            icon={<DetailIcon name="userFull" />}
                            value={creator}
                            valuePlaceholder="Creator's name"
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors.creator
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['creator']}
                                    required
                                    submitLabel="Add creator's name"
                                    title="Please provide your name"
                                    value={creator}
                                    onSubmit={(newCreator) => {
                                        OpenDataPayload.pick({
                                            creator: true,
                                        }).parse({
                                            creator: newCreator,
                                        })

                                        setErrors((errors) => {
                                            delete errors.creator
                                        })

                                        update((project) => {
                                            project.creator = newCreator
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={<DetailIcon name="web" />}
                            value={contact.url}
                            valuePlaceholder="Site URL"
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.url']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.url']}
                                    placeholder="https://siteinfo.com"
                                    submitLabel="Add site URL"
                                    title="Please add a site URL"
                                    value={contact.url}
                                    onSubmit={(url) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                url,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.url']
                                        })

                                        update(({ contact }) => {
                                            contact.url = url
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={<DetailIcon name="email" />}
                            value={contact.email}
                            valuePlaceholder="Contact email"
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.email']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.email']}
                                    placeholder="owner@example.com"
                                    submitLabel="Add contact email"
                                    title="Please add a contact email"
                                    value={contact.email}
                                    onSubmit={(email) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                email,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.email']
                                        })

                                        update(({ contact }) => {
                                            contact.email = email
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={
                                <DetailIcon
                                    name="twitter"
                                    $color={contact.twitter ? '#1da1f2' : void 0}
                                />
                            }
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.twitter']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.twitter']}
                                    submitLabel="Add Twitter link"
                                    title="Please add Twitter link"
                                    value={contact.twitter}
                                    onSubmit={(twitter) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                twitter,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.twitter']
                                        })

                                        update(({ contact }) => {
                                            contact.twitter = twitter
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={
                                <DetailIcon
                                    name="telegram"
                                    $color={contact.telegram ? '#2aabee' : void 0}
                                />
                            }
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.telegram']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.telegram']}
                                    submitLabel="Telegram link"
                                    title="Please add Telegram link"
                                    value={contact.telegram}
                                    onSubmit={(telegram) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                telegram,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.telegram']
                                        })

                                        update(({ contact }) => {
                                            contact.telegram = telegram
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={
                                <DetailIcon
                                    name="reddit"
                                    $color={contact.reddit ? '#ff5700' : void 0}
                                />
                            }
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.reddit']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.reddit']}
                                    submitLabel="Reddit link"
                                    title="Please add Reddit link"
                                    value={contact.reddit}
                                    onSubmit={(reddit) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                reddit,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.reddit']
                                        })

                                        update(({ contact }) => {
                                            contact.reddit = reddit
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                    <li>
                        <DetailDropdown
                            icon={
                                <DetailIcon
                                    name="linkedin"
                                    $color={contact.linkedIn ? '#0077b5' : void 0}
                                />
                            }
                            onClose={() => {
                                setErrors((errors) => {
                                    delete errors['contact.linkedIn']
                                })
                            }}
                        >
                            {(close) => (
                                <ProjectProperty
                                    disabled={busy}
                                    error={errors['contact.linkedIn']}
                                    value={contact.linkedIn}
                                    title="Please add LinkedIn link"
                                    submitLabel="LinkedIn link"
                                    onSubmit={(linkedIn) => {
                                        OpenDataPayload.pick({
                                            contact: true,
                                        }).parse({
                                            contact: {
                                                linkedIn,
                                            },
                                        })

                                        setErrors((errors) => {
                                            delete errors['contact.linkedIn']
                                        })

                                        update(({ contact }) => {
                                            contact.linkedIn = linkedIn
                                        })

                                        close()
                                    }}
                                />
                            )}
                        </DetailDropdown>
                    </li>
                </DetailDropdownList>
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
