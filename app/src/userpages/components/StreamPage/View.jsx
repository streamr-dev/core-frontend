import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import Layout from '$shared/components/Layout/Core'
import Label from '$ui/Label'
import { SM, MEDIUM } from '$shared/utils/styled'
import TOCPage, { Title } from '$shared/components/TOCPage'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import Display from '$shared/components/Display'
import useCopy from '$shared/hooks/useCopy'
import { scrollTop } from '$shared/hooks/useScrollToTop'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { CoreHelmet } from '$shared/components/Helmet'
import { fieldTypes } from '$userpages/utils/constants'
import { selectUserData } from '$shared/modules/user/selectors'
import getStreamPath from '$app/src/getters/getStreamPath'
import PartitionsSection from '$app/src/pages/AbstractStreamEditPage/PartitionsSection'
import HistorySection from '$app/src/pages/AbstractStreamEditPage/HistorySection'
import PreviewSection from '$app/src/pages/AbstractStreamEditPage/PreviewSection/index'
import CodeSnippetsSection from '$app/src/pages/AbstractStreamEditPage/CodeSnippetsSection'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import routes from '$routes'
import { useController } from '../StreamController'
import {
    StreamIdFormGroup,
    FormGroup,
    Field,
    Text,
} from './shared/FormGroup'

const FieldGroup = styled(FormGroup)`
    @media (min-width: ${SM}px) {
        & + & {
            margin-top: 16px;
        }

        & + & ${Label} {
            display: none;
        }
    }
`

const UnstyledView = (props) => {
    const { stream } = useController()
    const { copy, isCopied } = useCopy()
    const { truncatedDomain: domain, pathname } = getStreamPath(stream.id)
    const currentUser = useSelector(selectUserData)
    const history = useHistory()

    const onBack = useCallback(() => {
        scrollTop()

        if (currentUser) {
            history.push(routes.streams.index())
        } else {
            history.push(routes.root())
        }
    }, [history, currentUser])

    const onCopy = useCallback((id) => {
        copy(id)

        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <Layout
            {...props}
            nav={false}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    left={(
                        <BackButton onBack={onBack} />
                    )}
                />
            )}
        >
            <CoreHelmet title={stream.id} />
            <TOCPage title="Read only stream">
                <TOCSection
                    id="details"
                    title="Details"
                >
                    <StreamIdFormGroup hasDomain={!!domain} data-test-hook="StreamId">
                        {!!domain && (
                            <React.Fragment>
                                <Field
                                    label="Domain"
                                >
                                    <Text
                                        value={domain}
                                        readOnly
                                        disabled
                                        name="domain"
                                    />
                                </Field>
                                <Field narrow>
                                    /
                                </Field>
                                <Field
                                    label="Path name"
                                >
                                    <Text
                                        value={pathname}
                                        readOnly
                                        disabled
                                        name="pathname"
                                    />
                                </Field>
                            </React.Fragment>
                        )}
                        {!domain && (
                            <Field
                                label="Stream ID"
                            >
                                <Text
                                    value={pathname}
                                    readOnly
                                    disabled
                                    name="streamId"
                                />
                            </Field>
                        )}
                        <Field
                            narrow
                        >
                            <Button kind="secondary" onClick={() => onCopy(stream.id)}>
                                {!isCopied && 'Copy Stream ID'}
                                {!!isCopied && 'Copied!'}
                            </Button>
                        </Field>
                    </StreamIdFormGroup>
                    {!!stream.description && (
                        <FormGroup>
                            <Field label="Description">
                                <Text
                                    value={stream.description || ''}
                                    readOnly
                                    disabled
                                    name="description"
                                />
                            </Field>
                        </FormGroup>
                    )}
                </TOCSection>
                <StreamIdContext.Provider value={stream.id}>
                    <CodeSnippetsSection />
                </StreamIdContext.Provider>
                {!!stream.config.fields.length && (
                    <TOCSection
                        id="fields"
                        title="Fields"
                    >
                        {stream.config.fields.map(({ name, type, id }) => (
                            <FieldGroup key={name}>
                                <Field label="Field name">
                                    <Text id={`name-${id}`} disabled value={name} readOnly />
                                </Field>
                                <Field label="Data type" narrow>
                                    <Text
                                        id={`type-${id}`}
                                        disabled
                                        value={fieldTypes[type]}
                                        readOnly
                                    />
                                </Field>
                            </FieldGroup>
                        ))}
                    </TOCSection>
                )}
                <StreamIdContext.Provider value={stream.id}>
                    <PreviewSection
                        desc={null}
                    />
                </StreamIdContext.Provider>
                <Display $mobile="none" $desktop>
                    <HistorySection
                        desc={null}
                        disabled
                        duration={stream.storageDays}
                    />
                </Display>
                <PartitionsSection
                    desc={null}
                    disabled
                    partitions={stream.partitions || 1}
                />
            </TOCPage>
        </Layout>
    )
}

const View = styled(UnstyledView)`
    p {
        line-height: 1.5em;
    }

    strong {
        font-weight: ${MEDIUM};
    }

    ${Text} + * {
        margin-left: 16px;
    }

    ${Title} {
        display: block;
    }
`

export default View
