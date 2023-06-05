import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { DetailEditor } from '$shared/components/DetailEditor'
import { LAPTOP } from '$shared/utils/styled'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { ProjectDetailIcon } from '$mp/containers/ProjectEditing/ProjectDetails.styles'

const ProjectDetailsWrap = styled.div`
    display: flex;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 4;
    grid-row-end: 4;
    margin-top: 24px;

    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 3;
        grid-row-end: 3;
        margin: 50px 50px 50px 0;
    }

    .detail {
        flex-shrink: 1;
        margin-right: 6px;
    }
`

export const ProjectDetails: FunctionComponent = () => {
    const { state: project } = useContext(ProjectStateContext)
    const { updateContactUrl, updateContactEmail, updateSocialUrl, updateCreator } =
        useEditableProjectActions()

    return (
        <ProjectDetailsWrap>
            <DetailEditor
                className="detail"
                defaultIcon={<ProjectDetailIcon name={'userFull'} />}
                unsetValueText="Creator's name"
                instructionText="Please provide your name"
                ctaButtonText="creator's name"
                value={project?.creator}
                onChange={(value) => updateCreator(value.toString().trim())}
                showValue={true}
                optional={false}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().required().trim().max(255)
                            return !!schema.isValidSync(value)
                        },
                        message: 'Name is too long',
                    },
                    {
                        validator: (value) => {
                            const schema = yup.string().required().trim().min(1)
                            return !!schema.isValidSync(value)
                        },
                        message: 'Name is too short',
                    },
                ]}
            />
            <DetailEditor
                className="detail"
                unsetValueText="Site URL"
                defaultIcon={<ProjectDetailIcon name={'web'} />}
                showValue={true}
                instructionText="Please add a site URL"
                ctaButtonText="site URL"
                placeholder="https://siteinfo.com"
                onChange={updateContactUrl}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().url()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid URL',
                    },
                ]}
                value={project?.contact?.url || ''}
            />
            <DetailEditor
                className="detail"
                unsetValueText="Contact email"
                defaultIcon={<ProjectDetailIcon name={'email'} />}
                showValue={true}
                instructionText="Please add a contact email"
                ctaButtonText="contact email"
                placeholder="owner@example.com"
                onChange={updateContactEmail}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().email()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid email address',
                    },
                ]}
                value={project?.contact?.email || ''}
            />
            <DetailEditor
                className="detail"
                defaultIcon={<ProjectDetailIcon name={'twitter'} />}
                instructionText="Please add Twitter link"
                ctaButtonText="Twitter link"
                hasValueIcon={
                    !!project?.contact?.twitter && (
                        <ProjectDetailIcon name={'twitter'} className={'twitterColor'} />
                    )
                }
                value={project?.contact?.twitter}
                onChange={(value) => updateSocialUrl('twitter', value)}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().url()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid URL',
                    },
                ]}
            />
            <DetailEditor
                className="detail"
                defaultIcon={<ProjectDetailIcon name={'telegram'} />}
                instructionText="Please add Telegram link"
                ctaButtonText="Telegram link"
                hasValueIcon={
                    !!project?.contact?.telegram && (
                        <ProjectDetailIcon
                            name={'telegram'}
                            className={'telegramColor'}
                        />
                    )
                }
                value={project?.contact?.telegram}
                onChange={(value) => updateSocialUrl('telegram', value)}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().url()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid URL',
                    },
                ]}
            />
            <DetailEditor
                className="detail"
                defaultIcon={<ProjectDetailIcon name={'reddit'} />}
                instructionText="Please add Reddit link"
                ctaButtonText="Reddit link"
                hasValueIcon={
                    !!project?.contact?.reddit && (
                        <ProjectDetailIcon name={'reddit'} className={'redditColor'} />
                    )
                }
                value={project?.contact?.reddit}
                onChange={(value) => updateSocialUrl('reddit', value)}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().url()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid URL',
                    },
                ]}
            />
            <DetailEditor
                defaultIcon={<ProjectDetailIcon name={'linkedin'} />}
                instructionText="Please add LinkedIn link"
                ctaButtonText="LinkedIn link"
                hasValueIcon={
                    !!project?.contact?.linkedIn && (
                        <ProjectDetailIcon
                            name={'linkedin'}
                            className={'linkedInColor'}
                        />
                    )
                }
                value={project?.contact?.linkedIn}
                onChange={(value) => updateSocialUrl('linkedIn', value)}
                optional={true}
                validation={[
                    {
                        validator: (value) => {
                            const schema = yup.string().trim().url()
                            return !!schema.isValidSync(value)
                        },
                        message: 'Not a valid URL',
                    },
                ]}
            />
        </ProjectDetailsWrap>
    )
}
