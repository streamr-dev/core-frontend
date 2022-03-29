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
import { scrollTop } from '$shared/hooks/useScrollToTop'
import { CoreHelmet } from '$shared/components/Helmet'
import { fieldTypes } from '$userpages/utils/constants'
import { selectUserData } from '$shared/modules/user/selectors'
import PartitionsSection from '$app/src/pages/AbstractStreamEditPage/PartitionsSection'
import HistorySection from '$app/src/pages/AbstractStreamEditPage/HistorySection'
import PreviewSection from '$app/src/pages/AbstractStreamEditPage/PreviewSection/index'
import CodeSnippetsSection from '$app/src/pages/AbstractStreamEditPage/CodeSnippetsSection'
import InfoSection from '$app/src/pages/AbstractStreamEditPage/InfoSection/index'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import routes from '$routes'
import { useController } from '../StreamController'
import {
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
                <StreamIdContext.Provider value={stream.id}>
                    <InfoSection desc={null} disabled />
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
                    <PreviewSection desc={null} />
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
