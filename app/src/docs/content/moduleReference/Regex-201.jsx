/* eslint-disable max-len */
import moduleDescription from './Regex-201.md'

export default {
    id: 201,
    name: 'Regex',
    path: 'Text',
    help: {
        params: {
            pattern: 'Regex pattern',
        },
        paramNames: [
            'pattern',
        ],
        inputs: {
            text: 'Text to be analyzed.',
        },
        inputNames: [
            'text',
        ],
        outputs: {
            'match?': '1 if in the text is something that matches with the pattern. Else 0.',
            matchCount: 'How many matches there are in the text.',
            matchList: "A list of the matches. An empty list if there aren't any.",
        },
        outputNames: [
            'match?',
            'matchCount',
            'matchList',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_i868vckZRqKPmkpEh3Qa5g',
            name: 'text',
            longName: 'Regex.text',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_kqPkq5U-Q5GmxMi4NgPYMA',
            name: 'match?',
            longName: 'Regex.match?',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_RwzcQbk5TKa518JW7dCbtg',
            name: 'matchCount',
            longName: 'Regex.matchCount',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_C3bDytJOSsOILGkwvvigDw',
            name: 'matchList',
            longName: 'Regex.matchList',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_sXjBWmDyRr2b-QS6afp9mw',
            name: 'pattern',
            longName: 'Regex.pattern',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
    ],
}
