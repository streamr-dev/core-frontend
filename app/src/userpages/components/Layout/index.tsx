import type { Node } from 'react'
import React, { Component, ReactNode } from 'react'
import CoreLayout from '$shared/components/Layout/Core'
import coreLayoutStyles from '$shared/components/Layout/core.pcss'
import BodyClass from '$shared/components/BodyClass'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Header from '../Header'
import './layout.pcss'
type Props = {
    children: Node
    headerAdditionalComponent?: Node
    headerSearchComponent?: Node
    headerFilterComponent?: Node
    noHeader?: boolean
    loading?: boolean
}

class UserpagesLayout extends Component<Props, object> {
    static defaultProps = {
        noHeader: false,
        loading: false,
    }

    render(): ReactNode {
        const {
            headerAdditionalComponent, headerSearchComponent, headerFilterComponent, noHeader, loading, ...props
        } =
            this.props
        return (
            <CoreLayout
                {...props}
                contentClassname={coreLayoutStyles.pad}
                footer={false}
                navComponent={
                    <React.Fragment>
                        <BodyClass className="core" />
                        <Header
                            additionalComponent={headerAdditionalComponent}
                            searchComponent={headerSearchComponent}
                            filterComponent={headerFilterComponent}
                            noHeader={noHeader}
                        />
                        <LoadingIndicator loading={!!loading} />
                    </React.Fragment>
                }
            />
        )
    }
}

export default UserpagesLayout
