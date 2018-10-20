// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { capital } from 'case'
import { push } from 'react-router-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'

import Layout from '../../Layout'
import links from '../../../../links'
import { getCanvases, deleteCanvas } from '../../../modules/canvas/actions'
import Tile from '$shared/components/Tile'
import DropdownActions from '$shared/components/DropdownActions'
import { formatExternalUrl } from '$shared/utils/url'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

import styles from './list.pcss'

export type StateProps = {
    canvases: any,
}

export type DispatchProps = {
    getCanvases: () => void,
    deleteCanvas: (id: string) => void,
    navigate: (to: string) => void,
}

type Props = StateProps & DispatchProps

class CanvasList extends Component<Props> {
    componentDidMount() {
        this.props.getCanvases()
    }

    getActions = (canvas) => {
        const { navigate, deleteCanvas } = this.props

        return (
            <Fragment>
                <DropdownActions.Item onClick={() => navigate(`${links.userpages.canvasEditor}/${canvas.id}`)}>
                    <Translate value="canvasList.edit" />
                </DropdownActions.Item>
                <DropdownActions.Item
                    onClick={() => console.error('Not implemented')}
                >
                    <Translate value="canvasList.share" />
                </DropdownActions.Item>
                <DropdownActions.Item>
                    <CopyToClipboard
                        text={formatExternalUrl(
                            process.env.PLATFORM_ORIGIN_URL,
                            process.env.PLATFORM_BASE_PATH,
                            `${links.userpages.canvasEditor}/${canvas.id}`,
                        )}
                    >
                        <Translate value="canvasList.copyUrl" />
                    </CopyToClipboard>
                </DropdownActions.Item>
                <DropdownActions.Item onClick={() => deleteCanvas(canvas.id)}>
                    <Translate value="canvasList.delete" />
                </DropdownActions.Item>
            </Fragment>
        )
    }

    render() {
        const { canvases } = this.props

        const cols = {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        }

        return (
            <Layout>
                <Container>
                    {!canvases.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                        >
                            <Translate value="canvasList.noCanvases" />
                            <Translate value="canvasList.noCanvasesHint" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {canvases.map((canvas) => (
                            <Col {...cols} key={canvas.id}>
                                <Tile
                                    link={`${links.userpages.canvasEditor}/${canvas.id}`}
                                    dropdownActions={this.getActions(canvas)}
                                >
                                    <div className={styles.title}>{canvas.name}</div>
                                    <div className={styles.date}>{new Date(canvas.updated).toLocaleString()}</div>
                                    <div className={styles.status}>{capital(canvas.state)}</div>
                                </Tile>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    canvases: state.canvas.list || [],
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCanvases: () => dispatch(getCanvases()),
    deleteCanvas: (id) => dispatch(deleteCanvas(id)),
    navigate: (to) => dispatch(push(to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CanvasList)
