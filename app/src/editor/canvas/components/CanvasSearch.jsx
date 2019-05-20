import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import links from '../../../links'
import { getCanvases } from '$userpages/modules/canvas/actions'
import { selectCanvases } from '$userpages/modules/canvas/selectors'

import SearchPanel, { SearchRow } from '$editor/shared/components/SearchPanel'
import styles from './CanvasSearch.pcss'

export default connect((state) => ({
    canvases: selectCanvases(state),
}), {
    getCanvases,
})(class CanvasSearch extends React.Component {
    state = {
        search: '',
    }

    componentDidMount() {
        this.props.getCanvases()
    }

    onChange = (search) => {
        this.setState({ search })
    }

    render() {
        const search = this.state.search.trim().toLowerCase()
        const otherCanvases = this.props.canvases.filter(({ id }) => id !== this.props.canvas.id)

        const canvases = search ? otherCanvases.filter(({ name }) => (
            name.toLowerCase().includes(search)
        )) : otherCanvases
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.Overlay} onClick={() => this.props.open(false)} hidden={!this.props.isOpen} />
                <SearchPanel
                    placeholder="Search or select a canvas"
                    className={styles.CanvasSearch}
                    onChange={this.onChange}
                    isOpen={this.props.isOpen}
                    open={this.props.open}
                    dragDisabled
                    headerHidden
                    minHeightMinimized={352}
                    maxHeight={352}
                    defaultHeight={352}
                >
                    {canvases.map((canvas) => (
                        <SearchRow key={canvas.id} className={styles.CanvasSearchRow}>
                            <Link to={`${links.editor.canvasEditor}/${canvas.id}`}>
                                <span className={cx(styles.canvasState, styles[canvas.state.toLowerCase()])} />
                                {startCase(canvas.name)}
                            </Link>
                        </SearchRow>
                    ))}
                </SearchPanel>
            </React.Fragment>
        )
    }
})
