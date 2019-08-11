/* eslint-disable max-len */
import moduleDescription from './MODWT-70.md'

export default {
    id: 70,
    name: 'MODWT',
    path: 'Time Series: Filtering',
    help: {
        params: {
            wavelet: 'Chosen wavelet filter',
            level: 'Transform level (1..N)',
        },
        paramNames: [
            'wavelet',
            'level',
        ],
        inputs: {
            in: 'Input time series**',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            details: 'The wavelet detail',
            energy: 'Energy at this level',
            smooth: 'The wavelet smooth',
        },
        outputNames: [
            'details',
            'energy',
            'smooth',
        ],
        helpText: moduleDescription,
    },
}
