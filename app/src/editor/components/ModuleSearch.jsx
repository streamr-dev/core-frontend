import React from 'react'
import startCase from 'lodash/startCase'
import { I18n } from 'react-redux-i18n'

import { getModuleTree } from '../services'
import { moduleTreeSearch } from '../state'

import styles from './ModuleSearch.pcss'

export default class ModuleSearch extends React.PureComponent {
    state = {
        search: '',
        modules: [],
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
    }

    async load() {
        const modules = await getModuleTree()
        if (this.unmounted) { return }
        this.setState({ modules })
    }

    onChange = (event) => {
        const { value } = event.currentTarget
        this.setState({ search: value })
    }

    onSelect = (id) => {
        this.props.open(false)
        this.props.addModule({ id })
    }

    onKeyDown = (event) => {
        if (this.props.isOpen && event.key === 'Escape') {
            this.props.open(false)
        }
    }

    onInputRef = (el) => {
        this.input = el
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
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.Overlay} onClick={() => this.props.open(false)} hidden={!this.props.isOpen} />
                <div className={styles.ModuleSearch} hidden={!this.props.isOpen}>
                    <div className={styles.Header}>
                        <button onClick={() => this.props.open(false)}>X</button>
                    </div>
                    <div className={styles.Input}>
                        <input
                            ref={this.onInputRef}
                            placeholder={I18n.t('editor.module.searchPlaceholder')}
                            value={this.state.search}
                            onChange={this.onChange}
                        />
                    </div>
                    <div role="listbox" className={styles.Content}>
                        {moduleTreeSearch(this.state.modules, this.state.search).map((m) => (
                            /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                            /* eslint-disable-next-line */
                            <div role="option" key={m.id} onClick={() => this.onSelect(m.id)}>
                                {startCase(m.name)}
                            </div>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
