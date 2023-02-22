import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { DetailEditor } from '$shared/components/DetailEditor'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, LAPTOP } from '$shared/utils/styled'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'

const ProjectDetailsWrap = styled.div`
  display: flex;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 4;
  grid-row-end: 4;
  margin-top: 24px;

  @media(${LAPTOP}) {
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 3;
    margin: 50px;
  }
  
  .detail {
    flex-shrink: 1;
    margin-right: 6px;
  }
`

const StandardIcon = styled(SvgIcon)`
  color: ${COLORS.primary};
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  &.twitterColor {
    color: #1DA1F2;
  }
  &.telegramColor {
    color: #2AABEE;
  }
  &.redditColor {
    color: #FF5700;
  }
  &.linkedInColor {
    color: #0077B5;
  }
`

export const ProjectDetails: FunctionComponent = () => {
    const { state: project } = useContext(ProjectStateContext)
    const { updateContactUrl, updateContactEmail, updateSocialUrl } = useEditableProjectActions()

    return <ProjectDetailsWrap>
        <DetailEditor
            className={'detail'}
            unsetValueText={'Site URL'}
            defaultIcon={<StandardIcon name={'web'}/>}
            showValue={true}
            instructionText={'Please add a site URL'}
            ctaButtonText={'site URL'}
            placeholder={'https://siteinfo.com'}
            onChange={updateContactUrl}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
            value={project?.contact?.url || ''}
        />
        <DetailEditor
            className={'detail'}
            unsetValueText={'Contact email'}
            defaultIcon={<StandardIcon name={'email'}/>}
            showValue={true}
            instructionText={'Please add a contact email'}
            ctaButtonText={'contact email'}
            placeholder={'owner@example.com'}
            onChange={updateContactEmail}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().email()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid email address'
            }]}
            value={project?.contact?.email || ''}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'twitter'}/>}
            instructionText={'Please add Twitter link'}
            ctaButtonText={'Twitter link'}
            hasValueIcon={!!project?.contact?.twitter && <StandardIcon name={'twitter'} className={'twitterColor'}/>}
            value={project?.contact?.twitter}
            onChange={(value) => updateSocialUrl('twitter', value)}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'telegram'}/>}
            instructionText={'Please add Telegram link'}
            ctaButtonText={'Telegram link'}
            hasValueIcon={!!project?.contact?.telegram && <StandardIcon name={'telegram'} className={'telegramColor'}/>}
            value={project?.contact?.telegram}
            onChange={(value) => updateSocialUrl('telegram', value)}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'reddit'}/>}
            instructionText={'Please add Reddit link'}
            ctaButtonText={'Reddit link'}
            hasValueIcon={!!project?.contact?.reddit && <StandardIcon name={'reddit'} className={'redditColor'}/>}
            value={project?.contact?.reddit}
            onChange={(value) => updateSocialUrl('reddit', value)}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            defaultIcon={<StandardIcon name={'linkedin'}/>}
            instructionText={'Please add LinkedIn link'}
            ctaButtonText={'LinkedIn link'}
            hasValueIcon={!!project?.contact?.linkedIn && <StandardIcon name={'linkedin'} className={'linkedInColor'}/>}
            value={project?.contact?.linkedIn}
            onChange={(value) => updateSocialUrl('linkedIn', value)}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
    </ProjectDetailsWrap>
}
