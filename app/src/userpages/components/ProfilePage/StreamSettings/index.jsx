// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ToggleField from '$userpages/components/ToggleField'
import TextInput from '$shared/components/TextInput'

import styles from './streamSettings.pcss'

type Props = {}
type State = {
    requireSignedMessages: boolean,
    historicalStoragePeriod: string,
}

class StreamSettings extends React.Component<Props, State> {
    state = {
        requireSignedMessages: false,
        historicalStoragePeriod: '365',
    }

    onToggleChange = (checked: boolean) => {
        this.setState({
            requireSignedMessages: checked,
        })
    }

    onValueChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            historicalStoragePeriod: e.target.value,
        })
    }

    render() {
        const { requireSignedMessages, historicalStoragePeriod } = this.state

        return (
            <div>
                <ToggleField
                    label={I18n.t('userpages.profilePage.streams.requireSignedMessages')}
                    value={requireSignedMessages}
                    onChange={this.onToggleChange}
                />
                <div className={styles.historicalStoragePeriod}>
                    <Translate value="userpages.profilePage.streams.historicalStoragePeriod.description" />
                </div>
                <div className={styles.input}>
                    <TextInput
                        type="number"
                        label={I18n.t('userpages.profilePage.streams.historicalStoragePeriod.label')}
                        value={historicalStoragePeriod}
                        onChange={this.onValueChange}
                        preserveLabelSpace
                    />
                </div>
            </div>
        )
    }
}

export default StreamSettings
