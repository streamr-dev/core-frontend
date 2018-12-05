import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import links from '../../links'
import { getCanvases } from '../../userpages/modules/canvas/actions'
import { selectCanvases } from '../../userpages/modules/canvas/selectors'

import searchStyles from './ModuleSearch.pcss'
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
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (this.props.isOpen && event.key === 'Escape') {
            this.props.open(false)
        }
    }

    onChange = (event) => {
        const { value } = event.currentTarget
        this.setState({ search: value })
    }

    onInputRef = (el) => {
        this.input = el
    }

    static getDerivedStateFromProps(props, state) {
        // clear search on close
        if (!props.isOpen && state.search) {
            return {
                search: '',
            }
        }
        return null
    }

    componentDidUpdate(prevProps) {
        // focus input on open
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.input) {
                this.input.focus()
            }
        }
    }

    render() {
        const search = this.state.search.trim().toLowerCase()
        const canvases = search ? this.props.canvases.filter(({ name }) => (
            name.toLowerCase().includes(search)
        )) : this.props.canvases
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={searchStyles.Overlay} onClick={() => this.props.open(false)} hidden={!this.props.isOpen} />
                <div className={cx(searchStyles.ModuleSearch, styles.CanvasSearch)} hidden={!this.props.isOpen}>
                    <div className={searchStyles.Input}>
                        <input
                            placeholder={I18n.t('editor.canvas.searchPlaceholder')}
                            ref={this.onInputRef}
                            value={this.state.search}
                            onChange={this.onChange}
                        />
                    </div>
                    <div role="listbox" className={cx(searchStyles.Content, styles.Content)}>
                        {canvases.map((canvas) => (
                            <Link key={canvas.id} to={`${links.userpages.canvasEditor}/${canvas.id}`}>
                                <span className={cx(styles.canvasState, styles[canvas.state.toLowerCase()])} />
                                {startCase(canvas.name)}
                            </Link>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
})
