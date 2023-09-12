import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
    useIsProjectBusy,
    useProject,
    useUpdateProject,
} from '~/shared/stores/projectEditor'
import { COLORS, TABLET } from '~/shared/utils/styled'
import RichTextEditor from '~/components/RichTextEditor'
import DetailDropdown, {
    DetailIcon,
    List as DetailDropdownList,
} from '~/components/DetailDropdown'
import ProjectProperty from '~/components/ProjectProperty'
import CoverImage, { Root as CoverImageRoot } from './CoverImage'
import { getBase64ForFile } from '~/getters'
import { toaster } from 'toasterhea'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import { Layer } from '~/utils/Layer'

const cropModal = toaster(CropImageModal, Layer.Modal)

export default function EditorHero() {
    const { creator, contact, name, description, imageUrl } = useProject({ hot: true })

    const [newImageUrl, setNewImageUrl] = useState<string>()

    const update = useUpdateProject()

    const busy = useIsProjectBusy()

    const imageAbortControllerRef = useRef<AbortController>()

    useEffect(() => {
        const { current: abortController } = imageAbortControllerRef

        return () => {
            abortController?.abort()
        }
    }, [])

    return (
        <HeroContainer>
            <div>
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
            </div>
            <DetailsWrap>
                <NameInput
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => {
                        update((project) => {
                            project.name = e.target.value
                        })
                    }}
                />
                <Desc>
                    <RichTextEditor
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    required
                                    submitLabel="Add creator's name"
                                    title="Please provide your name"
                                    value={creator}
                                    onSubmit={(newCreator) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    placeholder="https://siteinfo.com"
                                    submitLabel="Add site URL"
                                    title="Please add a site URL"
                                    value={contact.url}
                                    onSubmit={(url) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    placeholder="owner@example.com"
                                    submitLabel="Add contact email"
                                    title="Please add a contact email"
                                    value={contact.email}
                                    onSubmit={(email) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    submitLabel="Add Twitter link"
                                    title="Please add Twitter link"
                                    value={contact.twitter}
                                    onSubmit={(twitter) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    submitLabel="Telegram link"
                                    title="Please add Telegram link"
                                    value={contact.telegram}
                                    onSubmit={(telegram) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    submitLabel="Reddit link"
                                    title="Please add Reddit link"
                                    value={contact.reddit}
                                    onSubmit={(reddit) => {
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
                        >
                            {(close) => (
                                <ProjectProperty
                                    value={contact.linkedIn}
                                    title="Please add LinkedIn link"
                                    submitLabel="LinkedIn link"
                                    onSubmit={(linkedIn) => {
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
    font-size: 34px;
    line-height: 44px;
    margin: 10px 0 24px;
    outline: 0 !important;
    padding: 0;
    width: 100%;

    ::placeholder {
        color: ${COLORS.primaryDisabled};
    }
`

const DetailsWrap = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;

    ${DetailDropdownList} {
        margin-top: 48px;
    }
`

const Desc = styled.div`
    flex-grow: 1;
`

const HeroContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    display: flex;
    padding: 24px;

    @media ${TABLET} {
        padding: 40px;
    }

    ${CoverImageRoot} {
        flex-shrink: 0;
        margin-right: 40px;
    }
`
