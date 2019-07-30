/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './SumByKey-222.mdx'

export default {
  "id": 222,
  "name": "SumByKey",
  "path": "Map",
  "help": {
    "params": {
      "windowLength": "Limit moving window size of sum.",
      "sort": "Whether key-sum pairs should be order by sums",
      "maxKeyCount": "Maximum number of (sorted) key-sum pairs to keep. Everything else will be dropped."
    },
    "paramNames": [
      "windowLength",
      "sort",
      "maxKeyCount"
    ],
    "inputs": {
      "value": "The value to be added to aggregated sum.",
      "key": "The (string) key"
    },
    "inputNames": [
      "value",
      "key"
    ],
    "outputs": {
      "map": "Key-sum pairs",
      "valueOfCurrentKey": "The aggregated sum of the last key received. "
    },
    "outputNames": [
      "map",
      "valueOfCurrentKey"
    ],
    "helpText": moduleDescription
  }
}
