import * as yup from 'yup'
import { isAddress } from 'web3-validator'
import { ProjectType } from '~/shared/types'
import { ObjectPaths } from '~/utils/objectPaths'
import { ContactDetails, Project } from '../types/project-types'
import { validateSalePoint } from './validate'

const urlValidator = yup.string().trim().url()

const emailValidator = yup.string().trim().email()

const descriptionRegExp = new RegExp(/^(\\+\n?)*$/)

export const validate = (
    project: Project,
): Partial<Record<ObjectPaths<Project>, boolean>> => {
    const invalidFields: { [key: string]: boolean } = {}
    ;['name', 'description'].forEach((field) => {
        invalidFields[field] = !project[field as keyof Project]
    })
    if (!!project.description && descriptionRegExp.test(project.description)) {
        invalidFields.description = true
    }
    invalidFields.imageUrl = !project.imageUrl && !project.newImageToUpload
    invalidFields.streams = !project.streams || project.streams.length <= 0

    if (!project.creator || project.creator.length > 256) {
        invalidFields.creator = true
    }

    if (project.contact) {
        ;['url', 'social1', 'social2', 'social3', 'social4'].forEach((field) => {
            if (
                project.contact[field as keyof ContactDetails] &&
                project.contact[field as keyof ContactDetails].length > 0
            ) {
                invalidFields[`contact.${field}`] = !urlValidator.isValidSync(
                    project.contact[field as keyof ContactDetails],
                )
            }
        })

        if (project.contact.email && project.contact.email.length > 0) {
            const result = emailValidator.isValidSync(project.contact.email)
            invalidFields['contact.email'] = !result && !!project.contact.email
        }
    }

    // applies only to data union
    if (project.type === ProjectType.DataUnion) {
        invalidFields.adminFee =
            !!project.isDeployingNewDU &&
            (project.adminFee === undefined ||
                +project.adminFee < 0 ||
                +project.adminFee > 100)
        invalidFields.dataUnionChainId = !project.dataUnionChainId
        invalidFields.existingDUAddress =
            !project.isDeployingNewDU &&
            (!project.existingDUAddress || !isAddress(project.existingDUAddress))
    }

    // applies to paid projects and data unions
    if ([ProjectType.PaidData, ProjectType.DataUnion].includes(project.type)) {
        if (!project?.salePoints || !Object.values(project?.salePoints || {}).length) {
            invalidFields.salePoints = true
        }
        if (Object.keys(project?.salePoints || {}).length) {
            Object.keys(project?.salePoints || {}).forEach((chainName) => {
                const salePoint = project.salePoints?.[chainName]
                if (salePoint == null) {
                    return
                }
                const invalidSalePointFields = validateSalePoint(
                    salePoint,
                    project.type === ProjectType.DataUnion,
                )
                if (!!invalidSalePointFields && invalidSalePointFields.length) {
                    invalidFields[`salePoints.${chainName}`] = true
                }
            })
        }
    }
    return invalidFields
}
