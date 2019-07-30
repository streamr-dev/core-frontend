/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './MODWT-70.mdx'

export default {
  "id": 70,
  "name": "MODWT",
  "path": "Time Series: Filtering",
  "help": {
    "params": {
      "wavelet": "<span>Chosen wavelet filter</span>",
      "level": "<span>Transform level (1..N)</span>"
    },
    "paramNames": [
      "wavelet",
      "level"
    ],
    "inputs": {
      "in": "<span>Input time series</span>"
    },
    "inputNames": [
      "in"
    ],
    "outputs": {
      "details": "<span>The wavelet detail</span>",
      "energy": "<span>Energy at this level</span>",
      "smooth": "<span>The wavelet smooth</span>"
    },
    "outputNames": [
      "details",
      "energy",
      "smooth"
    ],
    "helpText": moduleDescription
  }
}
