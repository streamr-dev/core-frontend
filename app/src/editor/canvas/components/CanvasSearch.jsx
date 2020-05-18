import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import routes from '$routes'
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
        const { className } = this.props
        const search = this.state.search.trim().toLowerCase()
        const otherCanvases = this.props.canvases.filter(({ id }) => id !== this.props.canvas.id)

        const canvases = search ? otherCanvases.filter(({ name }) => (
            name.toLowerCase().includes(search)
        )) : otherCanvases
        return (
            <SearchPanel
                placeholder="Search or select a canvas"
                className={cx(className, styles.CanvasSearch)}
                onChange={this.onChange}
                isOpen={this.props.isOpen}
                open={this.props.open}
                dragDisabled
                headerHidden
                minHeight={352}
                maxHeight={352}
                defaultHeight={352}
                closeOnBlur
            >

                {canvases.map((canvas, index) => (
                    /* eslint-disable react/no-array-index-key */
                    <SearchRow
                        key={index}
                        className={styles.CanvasSearchRow}
                        component={Link}
                        refName="innerRef"
                        to={routes.canvases.edit({
                            id: canvas.id,
                        })}
                    >
                        <span className={cx(styles.canvasState, styles[canvas.state.toLowerCase()])} />
                        {startCase(canvas.name)}
                    </SearchRow>
                    /* eslint-enable react/no-array-index-key */
                ))}
            </SearchPanel>
        )
    }
})
